// https://node-postgres.com/features/pooling

import pg from 'pg';

// import { loginInfo } from './loginInfo.js';
let loginObj = {
  host: process.env.DBHOST,
  port:process.env.DBPORT,
  database:process.env.DB,
  user:process.env.RESTRICTED,
  password:process.env.RESTRICTEDP
}

const pool = new pg.Pool(loginObj);

// 2022-09-23-CMF: Handle errors from the database connection pool (code from mini-API)
pool.on('error', (err) => {  
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// 2022-09-23-CMF: Query database for each request (code from mini-API)
async function getQueryResult(selectStatement: string) {
  let result;
  const client = await pool.connect(); 
  try { result = (await client.query(selectStatement)).rows; } 
  finally { client.release() };
  return result;
}

async function getColumnDescriptions(dbTableName: string) {
  return await getQueryResult(
    `SELECT t."Field" as column_name, t."Description" as column_description
     FROM public_test."tblSchema" t
     WHERE t."Table" = '${dbTableName}'`
  )
}

export default getColumnDescriptions