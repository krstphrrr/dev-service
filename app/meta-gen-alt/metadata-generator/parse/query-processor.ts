import env from '../env'
import getColumnDescriptions from '../../database/queries-metadata'
import getCsvDataTableHeaders from './csv-parser'

export async function extractColumnDescriptions(csvBlob, tablename) {
  if(csvBlob!==null){
    let csvHeaderNames = await getCsvDataTableHeaders(csvBlob)
    let queryResults = await getColumnDescriptions(tablename)

    for(let queryResult of queryResults){
      if(csvHeaderNames!==null && csvHeaderNames!==undefined){
        const indexOfColumnName = csvHeaderNames.indexOf(queryResult.column_name)
          if (indexOfColumnName >= 0) {  // to skip rid
            const columnDescription = (queryResult.column_description === null) ? '' : queryResult.column_description

            csvHeaderNames[indexOfColumnName] = 
              csvHeaderNames[indexOfColumnName] + env.DELIMITER + columnDescription.replace(/^"(.*)"$/, '$1')
          }
        }
        return csvHeaderNames
    }
  } else {
    return null
  }
}

export default extractColumnDescriptions