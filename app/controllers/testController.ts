require('dotenv').config();
import {NextFunction, Request, Response} from 'express'
import Files from "../models/files"
import {packager} from './packager'
import {setHeaderFields} from '../request-handler/get-routes'
import secrets from '../db/secrets'
import { newpackager } from './newpackager';
import fs from 'fs'

const AuthClient = require('auth0').AuthenticationClient

const auth0 = new AuthClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
})
////
// on request to this api: 
// pull data from main api 
// package it into zip file 

// download link page route
const timeSinceCreated =(createdTime, returnformat)=>{
  const creationTime:any = new Date(createdTime)
  const currentTime:any = new Date()
  const timeDiff = currentTime.getTime()-creationTime.getTime()
  switch(returnformat){
    case 'seconds':
      return timeDiff/1000
    case 'minutes':
      return (timeDiff/1000)/60
    case 'hours':
      return (timeDiff/1000)/3600
    default:
      return timeDiff/1000
  }
}

export const showData = async (req, res) => {
  // 
  let dl_link = process.env.APP_BASE_URL
  let filePath
  try {
      const file = await Files.findOne({ uuid: req.params.uuid });

      
      /* conditions:
      1. !file if file doesn't exist in mongodb: Packet request does not exist. Please request again.
      2. file & filesync false & diff<60 => request exists (local file doesnt) but less than an hour has passed: Processing request... (Refresh to update processing status)
      3. file & filesync false & diff>60 => request exists (local file doesnt ) but  more than 60 has passed. Request expired
      */ 
      if(!file){
          return res.render('download', { error: 'Packet request does not exist. Please request again.'});
      } else {
        filePath = `${file.path}`
        let diff = timeSinceCreated(file["createdAt"],'minutes')

        if (file && !fs.existsSync(filePath) && diff<60){ // if file exists 
            return res.render('download', { error: 'Processing request... (Refresh to update processing status)'});

        } else if (file && !fs.existsSync(filePath) && diff>60){
            return res.render('download', { error: 'Request expired. Please request data again.'});
            
        }
        return res.render('download', { uuid: file.uuid, fileName: file.filename, fileSize: file.size, downloadLink: `${dl_link}/api/files/download/${file.uuid}` });
      }
      

  } catch(err) {
    console.log(err)
      return res.render('download', { error: 'Something went wrong.'});
  }
};

// datapacket creation
export const createData = async (req:Request, res:Response, next: NextFunction) =>{

  const responseMetadata = await res.locals.test
  const access_token = req.auth.token  
  const user_profile = await auth0.getProfile(access_token)

  // test array to create multiple csv files and pack them
  console.log("GR")
  try{
    console.log(responseMetadata, "controller")
    newpackager(req,user_profile, responseMetadata)
    console.log("todavia no")
  }
  catch(err: any){
    console.log(err)
    next()
  }
}

export const responseData = async (req, res, next) => {
  console.log("llegue pre pre")
  res.status(200).send({"response":"okkk"})
  // setTimeout(x=>{
  //   console.log("lleuge pre")
  //   if(res.locals.respObj){
  //     console.log(res.locals.respObj)
  //     res.status(418).send({"response":"okkk"})
  //   }
  // }
  //   , 1000)
  
}

//  actual download provider
export const getData = async (req:Request, res:Response)=>{
  const file = await Files.findOne({uuid: req.params.uuid})
  if (!file){
    return res.status(200).send("file no longer exists!")
  }
  
  const filePath = `${file.path}`;
  res.download(filePath)
}

export const fileExists = async (req:Request, res: Response)=>{
  console.log(req.params.uuid)
  const file = await Files.findOne({uuid: req.params.uuid})

  let filePath
  if(file!==null){
    filePath = `${file.path}`;
  } else {
    return res.status(200).send({"err":"file has never been created"})
  }
  

  if(!fs.existsSync(filePath)){
    return res.status(200).send({"exists":false})
  } else {
    return res.status(200).send({"exists":true})
  }
}

