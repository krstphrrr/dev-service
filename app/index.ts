require('dotenv').config();
import { connect } from './db/database'
import express from 'express'

import path from 'path'
import testRoute from './routes/testRoute'
import cors from 'cors'

// import extractColumnDescriptions from  './meta-gen/metadata-generator/parse/query-processor'
// import 
// import { authCheck } from "./middleware/auth"
// const { auth } = require('express-oauth2-jwt-bearer');

const PORT = 5101;
const app = express()

app.use(cors({origin: "*"}))

app.use(express.static('public'))
app.use(express.json({limit:'10mb'}))
app.set('views', path.join(__dirname,'/views'))
app.set('view engine', 'ejs')

connect()
app.use('/api', testRoute)
app.get('/', (req,res)=>{
  res.send(__dirname)
})


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})