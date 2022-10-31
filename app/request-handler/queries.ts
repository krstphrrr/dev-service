import * as columns from './columns';

export interface QueryParameters { [key: string]: string[] };
export interface PostParameters { [key: string]: string[] };
 
// 2022-02-16-CMF: Used for processing requests and submitting database queries
export class QueryGenerator {

  private gi: string;
  private gidb: string;
  private primaryKey: string;
  private fromGeoIndicators: string;
  private and;
  
  delimiter: string;

  constructor() {
    this.gi = 'gi';
    this.gidb = this.gi + '.';
    this.primaryKey = this.gidb + `"${columns.filterQueryParametersToColumns['primaryKey']}"`
    this.fromGeoIndicators = 'FROM public_test."geoIndicators_view" ' + this.gi;
    this.delimiter = ',';
    this.and = " AND ";
  }

  // 2022-02-16-CMF: Returns a min/max query condition from min/max query-parameter values
  private getQueryMinMaxCondition(queryParameterName: string, queryParameterValues: string[]): string {
    const [min, max] = queryParameterValues;
    const columnName = columns.filterQueryParametersToColumns[queryParameterName];
    return `${this.gidb}"${columnName}" >= ${parseFloat(min)}${this.and}${this.gidb}"${columnName}" <= ${parseFloat(max)}`
  }
  
  // 2022-02-16-CMF: Returns a comma-delimited query condition
  private getQueryList(values: string[]) {
    // console.log(values)
    return '(\'' + values.join('\', \'') + '\')'
  }

 // 2022-02-16-CMF: Returns a comma-delimited list of table-column names
  private concatColumnNames(columnNames: string[]): string {
    return `${this.gidb}"` + columnNames.join(`",\n ${this.gidb}"`) + '" ';
  }

  // 2022-02-16-CMF: Returns unique elements in an array;
  //                reduces ecological-site parameter requests to single EcologicalSiteId column
  private getUniqueElements(array: string[]): string[] {
    const uniqueElements: string[] = [];
    for (let element of array) {
      if (!uniqueElements.includes(element)) {
        uniqueElements.push(element);
      }
    }
    return uniqueElements
  }

  // 2022-02-16-CMF: Return column names corresponding to query-parameter names
  private getColumnNames(queryParameterNames: string[]): string[] {
    let columnNames: string[] = [];
    for (let queryParameterName of queryParameterNames) {
      columnNames.push(columns.filterQueryParametersToColumns[queryParameterName])
    }
    return this.getUniqueElements(columnNames);
  }

  // 2022-02-16-CMF: Return column-name list for query parameters
  private getFilterColumnString(queryParameterNames?: string[]): string {
    let filterColumnString = queryParameterNames ? 
                             this.concatColumnNames(this.getColumnNames(queryParameterNames)) : 
                             this.concatColumnNames(this.getUniqueElements(Object.values(columns.filterQueryParametersToColumns)));
    return filterColumnString;
  }
  
  // 2022-02-16-CMF: Return latitude/longitude selection --- for showing all plots on initial map load
  private getRoundedLatLonSubClause(): string {
    return `\n ROUND(${this.gidb}"Latitude_NAD83", 8) as "Latitude_NAD83",` +
           `\n ROUND(${this.gidb}"Longitude_NAD83", 8) as "Longitude_NAD83"`
  }

  // 2022-02-16-CMF: Return full query for retrieving latitude/longitude values on initial map load
  // 2022-02-10-CMF: Added query parameters for Postman testing
  selectLatLonRounded(limitQueryParameter: PostParameters): string {
    let limit = Object.keys(limitQueryParameter).length ? 
                  'LIMIT ' + limitQueryParameter['limit'][0] : ''
    const query = `SELECT ${this.primaryKey},
                   ${this.getRoundedLatLonSubClause()}
                   ${this.fromGeoIndicators}
                   ${limit};`;
    return query
  }
  
  // 2022-02-16-CMF: Return all filter-column values from geoIndicators corresponding to PrimaryKey values specified as query-parameter values
  selectAllFilterColumns(primaryKeyQueryParameter: PostParameters): string {
    const query =  `SELECT ${this.getFilterColumnString()}, ${this.getRoundedLatLonSubClause()}
                    ${this.fromGeoIndicators.trim()}
                    WHERE ${this.primaryKey} IN ${this.getQueryList(primaryKeyQueryParameter.primaryKeys)}
                    ORDER BY ${this.primaryKey};`
    return query
  }
 
  // 2022-02-16-CMF: Return all records from specified database table having PrimaryKey values specified as query-parameter values
  selectAllTableColumns(queryParameters: PostParameters, dbTableName: string) {
    let dbTableNameAlt = "";
    if(dbTableName=="geoIndicators"){
     dbTableNameAlt = "geoIndicators_view"
    } else {
      dbTableNameAlt = dbTableName
    }
    const query =  `SELECT *
                    FROM public_test."${dbTableNameAlt}" AS ${dbTableName}
                    WHERE ${dbTableName}."PrimaryKey" IN ${this.getQueryList(queryParameters.primaryKeys)}
                    ORDER BY ${dbTableName}."PrimaryKey";`
    return query;
  }
} 