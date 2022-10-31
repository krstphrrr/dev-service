import fs from 'fs'
import JSZip from "jszip"
import path from 'path'

const { v4: uuidv4 } = require('uuid')
import { Client } from "@sendgrid/client";
import sgMail from "@sendgrid/mail";
import Files from "../models/files"

import {
  extractPostParameters,
  retrieveAndPrintAllTableData} from '../request-handler/get-routes'

import extractColumnDescriptions  from '../meta-gen-alt/metadata-generator/parse/query-processor'
import generateMetadataXmlFile from '../meta-gen-alt/metadata-generator/generate/metadata-generator'
import { response } from 'express';
/*
1. for each table, make a request to the db using miniapi functions get a json
  a. retrieveAndPrintAllTableData(extractPostParameters(request),request)
  b. returns promise (with json data when it resolves.)

2. turn the json into csv for packaging
  a. creatingCSV(jsondata/object, tablename)
  b. returns 
3. remove headers from csv ( modified CMF code - getCsvDataTableHeaders)
4. using headers, pull in descriptions from tblSchema (modified CMF code)
5. create xml nodes with header/description combo (modified CMF code - extract column descriptions)
6. deposit complete blobs of xml and csv data into zip file

*/

let timeout_len = (arraylength)=>{
  // initial array length
  const minp = 1; // min size of primarykey array
  const maxp = 39000; // max size of primarykey array

  // result range
  const minv = Math.log(10000); // min amount of timeout size (10s)
  const maxv = Math.log(50000); // max amount of timeout size (50s)

  // calculate adjustment factor
  const scale = (maxv-minv) / (maxp-minp);
  const return_val = Math.exp(minv + scale*(arraylength-minp))
  console.log(`using a timeout length of: ${return_val}`)
  return Math.round(return_val);
}

// sgMail.setClient(new Client());
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const linkCreator =  async ()=>{
  const responseObject = {}
  const directoryPath = `./temp`
  responseObject["uniqueName"] = `${Date.now()}-${Math.round(Math.random()*1E9)}.zip`
  responseObject["physicalDestination"] = `${directoryPath}/${responseObject["uniqueName"] }`

  responseObject["uniquePageID"]= uuidv4()
  responseObject["downloadLink"] =process.env.APP_BASE_URL
  responseObject["responseLink"] = `${responseObject["downloadLink"]}/api/files/${responseObject["uniquePageID"]}`

  return responseObject
}


export const newpackager = async (request, user_profile:any= {}, linkObject) =>{
    // new zip per request
    let zip: JSZip = new JSZip()
    const no_email = "notloggedin@error.com"
    // utility objects in promise-chain
    let descriptionObj= {}
    let xmlObject = {}
    console.log(timeout_len(request.body.data.primaryKeys.length))

    let filesize
    const uniqueName = linkObject["uniqueName"]
    
    const dest = linkObject["physicalDestination"]
    
    const uniquePageID = linkObject["uniquePageID"]
    
    const resLink = linkObject["responseLink"]
        
    ////////////////////////////////////////
    // parsing request with mini-api handler
  
    let fullTables = await retrieveAndPrintAllTableData(extractPostParameters(request), request)
    let initialPull= Promise.all(Object.values(fullTables))

    
    
    let allPromises = Promise.all([initialPull, fullTables])

    initialPull.then(x=>{
      for(let table of Object.keys(fullTables)){
        console.log(`printing ${table}!!`)
        fullTables[table].then(async data=>{
          let csv = await creatingCSV(data, table)
          if(csv!==null){
            zip.file(`${table}.csv`,csv)
          }
          let desc = await extractColumnDescriptions(csv,table)
          descriptionObj[table] = desc 
        })
        /*
          AFTER CSV added to zip 
          AFTER col descriptions parsed
          DO generate xml
        */
        .then(async not_used=>{
          if(descriptionObj[table]!==null && descriptionObj[table]!==undefined){
            xmlObject[table] = await generateMetadataXmlFile(descriptionObj[table], table)
          }
        })
        /*
          AFTER generate xml
          DO add xml to zip
        */
        .then(async not_used=>{
          console.log("zipeando xmls")
          zip.file(path.join("metadata",`${table}_metadata.xml`), xmlObject[table])
        })
      }
    })
    /*
     AFTER CSV generated and zipped 
     AFTER XML generated and zipped
     DO GENERATE ZIP LOCALLY
    */
    
    allPromises.then(finished=>{
      
          setTimeout(()=>{
            console.log("ultimo timer")
            
            zip.generateAsync({type:'nodebuffer'}, )
                .then(buff=>{
                  let response
                  fs.writeFile(dest,buff,(err)=>{
                    if(err) throw err;
                    fs.stat(dest, (err, stats) => {
                      if (err) {
                          console.log(`File doesn't exist.`);
                        } else {
                          filesize = stats.size
                    if(filesize){
                      if(user_profile.hasOwnProperty('email')){
                        const file = new Files({
                          user_email: user_profile.email,
                          filename: uniqueName,
                          uuid: uniquePageID,
                          path: dest,
                          size: filesize
                        })
                        response = file.save()
                      } else {
                        const file = new Files({
                          user_email: no_email,
                          filename: uniqueName,
                          uuid: uniquePageID,
                          path: dest,
                          size: filesize
                        })
                        response = file.save()
                      }
                      
                      

  // ADD MONGODB ENTRY after writing file to local filesystem
  // SEND MAIL
                      response.then((success)=>{
                        
                        // if(user_profile!==null){
                        //   let filelink = resLink
                        //   const msg = {
                        //     from: `LDC data provider <bonefont.work@gmail.com>`,
                        //     to: user_profile.email,
                        //     subject: 'LDC datapacket download is ready',
                        //     text: `Download link will expire in 24 hours!`,
                        //     html: `<strong>download <a href=${filelink}>link</a></strong>`
                        //     }
                            // sgMail
                            // .send(msg)
                            // .then(() => {
                            //   console.log('Email sent')
                            // })
                            // .catch((error) => {
                            //   console.error(error)
                            // })
                          // }
                        })

                } else {
                  console.log("filesize has not arrived")
                }
                        }
                      })
                    })
                  })
          },timeout_len(request.body.data.primaryKeys.length))
      
      console.log("done")
      
    })

}
  
  // function that creates csv from a JSON/response object from Postgres
const creatingCSV = async (myObj, tablename) => {

    const items = myObj
    if(items.length!==0){
      const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
   
      const header = Object.keys(items[0])
      
      const csv_file = [
        header.join(','), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
      ].join('\r\n')
      
      return csv_file
    } else {
      console.log(`'${tablename}' is empty in pg`)
      return null
    }
    
  }



