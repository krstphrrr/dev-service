// https://node-postgres.com/features/pooling
import {Pool} from 'pg'
import {
        poolSelector
      } from '../db/pg';

import path from 'path'
import fs from 'fs';

import { QueryGenerator, QueryParameters, PostParameters } from '../request-handler/queries';
import { gisDbTableNames } from '../request-handler/columns'; 

const queryGenerator = new QueryGenerator();
const delimiter = queryGenerator.delimiter

// 2022-02-15-CMF: Handle errors from database connection pool

// 2022-02-15-CMF: Set headers for all GET responses
// 2022-03-17-CMF: TO DO --- ADAPT TO POST-REQUEST PROCESSING
function setHeaderFields(res: any): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
}

function extractPostParameters(request: any): PostParameters {
  const postParameters: PostParameters = {};
  for (let property of Object.keys(request.body.data)) {
    postParameters[property] = request.body.data[property]
  }
  // console.log(postParameters)
  return postParameters;
}

// 2022-03-17-CMF: Send SQL query to database and return result 
async function getResult(selectStatement: string, pool: Pool): Promise<any> {
  let result;
  // console.log(pool)
  const client = await pool.connect(); 
  try { result = (await client.query(selectStatement)).rows; } 
  finally { client.release() };
  return result;
}

// 2022-03-17-CMF: Write retrieved database table data to JSON file
function outputTableData(tableName: string, tableData: string) {
  const outFile = path.join('./output', tableName + ".json")
  fs.writeFile(outFile, JSON.stringify(tableData), 
               (err: any) => { if (err) { console.error(err) } }
  )
}

// 2022-03-17-CMF: Retrieve and print data for single database table
async function retrieveAndOutputTableData(
  tableName: string, 
  primaryKeys: PostParameters,
  request:any
  ) {
  let tableQuery = ''
  if (tableName === 'filterTable') {
    tableQuery = queryGenerator.selectAllFilterColumns(primaryKeys)
  }
  else {
    tableQuery = queryGenerator.selectAllTableColumns(primaryKeys, tableName)
  }
  // outputTableData(tableName, await getResult(tableQuery))

  // KBF instead of creating jsons, just returns the data
  let pool = await poolSelector(request)
  
  let returnData = await getResult(tableQuery,pool)
  return returnData
}

// 2022-03-17-CMF: Retrieve and print data for all database tables
function retrieveAndPrintAllTableData(primaryKeys: PostParameters, request:any) {
  // each returned table is stored in an object
  let obj = {}
  obj['filterTable'] = retrieveAndOutputTableData('filterTable', primaryKeys, request)
  for (let tableName of gisDbTableNames) {
    obj[tableName] = retrieveAndOutputTableData(tableName, primaryKeys, request)
  }
  // KBF the object full of tables is returned
  return obj
}

// 2022-03-15-CMF: Process and print returned database table data
// 2022-03-17-CMF: TO DO --- CONVERT GET PROCESSING TO POST PROCESSING
// router.get('/download-data', async (request, response, next) => {
//   try {
//     setHeaderFields(response);
//     response.status(200).json('Request received: processing');
//     retrieveAndPrintAllTableData(extractQueryParameters(request))
//   }
//   catch(err: any) { 
//     console.log(err)
//     next() 
//   }
// })

export { setHeaderFields,
        //  extractQueryParameters, 
         extractPostParameters,
         retrieveAndPrintAllTableData };