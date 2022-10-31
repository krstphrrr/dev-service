import fs from 'fs'
import path from 'path'
import papa from 'papaparse'


async function getCsvDataTableHeaders(csvFile: string | undefined) {
  if(csvFile===undefined){
    console.log("no csv file / undefined")
    return null
  }else {
    let parseStream = papa.parse(csvFile, {header: true})
    return parseStream.meta.fields
  }
}


export default  getCsvDataTableHeaders