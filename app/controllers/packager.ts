
require('dotenv').config();
import fs from 'fs'
import JSZip from "jszip"
import Files from "../models/files"
const { v4: uuidv4 } = require('uuid')

import { Client } from "@sendgrid/client";
import sgMail from "@sendgrid/mail";
// import secrets from '../db/secrets'


import {
        // extractQueryParameters,
        extractPostParameters,
        retrieveAndPrintAllTableData} from '../request-handler/get-routes'


// sgMail.setClient(new Client());
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// storing results in zip, storing zip in local fs
export const packager = async (user_profile, request) =>{
  // new zip per request
  let zip: JSZip = new JSZip()
  
  const directoryPath = `/usr/src/temp`
  const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}.zip`
  const dest = `${directoryPath}/${uniqueName}`
  let filesize
  
  ////////////////////////////////////////
  // parsing request with mini-api handler

  let fullTables = await retrieveAndPrintAllTableData(extractPostParameters(request), request)
  console.log(fullTables)
  // adding all the promises inside the object into Promise.all
  let allPromises = Promise.all(Object.values(fullTables))

  // iterating over each promise, turning resulting jsons into csv's
  for(let table of Object.keys(fullTables)){
    fullTables[table].then(data=>{
      let csv = creatingCSV(data)
  // adding created CSV into zip file (takes a while)
      zip.file(`${table}.csv`,csv)
    })
  }
  // after all requested table promises are resolved, write zip file
  allPromises.then(finished=>{
    zip.generateAsync({type:'nodebuffer'}, )
    .then(buff=>{
      
      fs.writeFile(dest,buff,(err)=>{
        if(err) throw err;
        fs.stat(dest, (err, stats) => {
          if (err) {
              console.log(`File doesn't exist.`);
          } else {
  // incorporate request data into Mongo model
              filesize = stats.size
              if(filesize){
                const file = new Files({
                  user_email: user_profile.email,
                  filename: uniqueName,
                  uuid: uuidv4(),
                  path: dest,
                  size: filesize
                })
                let response = file.save()
                // console.log(response)
  // ADD MONGODB ENTRY after writing file to local filesystem
  // SEND MAIL
                let dl_link =process.env.APP_BASE_URL
                response.then((success)=>{
                  let filelink = `${dl_link}/api/files/${success.uuid}`
                  const msg = {
                    from: `LDC data provider <bonefont.work@gmail.com>`,
                    to: user_profile.email,
                    subject: 'LDC datapacket download is ready',
                    text: `Download link will expire in 24 hours!`,
                    html: `<strong>download <a href=${filelink}>link</a></strong>`
                  }
                  sgMail
                  .send(msg)
                  .then(() => {
                    console.log('Email sent')
                  })
                  .catch((error) => {
                    console.error(error)
                  })
  //  SEND LINK BACK to client

                  console.log("este es response: ", response)
                  console.log("este es success: ", success)
                  
                })
              } else {
                console.log("filesize has not arrived")
              }
            }
        });
      })  
    })
  
  // catch for the zip.generateasync promise
    .catch(err=>console.log(err))
  })
  // catch for the Promise.all 
  .catch(err=>console.log(err))
}

// function that creates csv from a JSON/response object from Postgres
const creatingCSV = (myObj) => {
    // csv
    console.log("LLEGUE A CREATING CSV")
    console.log()
    const items = myObj
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(items[0])
    
    const csv_file = [
      header.join(','), // header row first
      ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')
   
    return csv_file
  }
  