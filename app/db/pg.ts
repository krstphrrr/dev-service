
import { Pool } from "pg"
// import secrets from './secrets'

let loginObj = {
  host: process.env.DBHOST,
  port:process.env.DBPORT,
  database:process.env.DB,
}
const ul = 'user'
const up = 'password'
function poolSelector(request:any){

  const permissions = request.auth.payload.permissions
    if(
      !permissions.includes('read:NDOW') &&
      !permissions.includes('read:RHEM') &&
      !permissions.includes('read:NWERN')
    ){
      console.log("AUQi")
      loginObj[ul]=process.env.RESTRICTED
      loginObj[up]=process.env.RESTRICTEDP
      return new Pool(loginObj)
    }else if(
      permissions.includes('read:NDOW') &&
      !permissions.includes('read:RHEM') &&
      !permissions.includes('read:NWERN')
    ){
      console.log("ndow")
      loginObj[ul]=process.env.NDOW
      loginObj[up]=process.env.NDOWP
      return new Pool(loginObj)
    }else if(
      !permissions.includes('read:NDOW') &&
      permissions.includes('read:RHEM') &&
      !permissions.includes('read:NWERN')
    ){
      console.log("rhem")
      loginObj[ul]=process.env.RHEM
      loginObj[up]=process.env.RHEMP
      return new Pool(loginObj)
    }else if(
      !permissions.includes('read:NDOW') &&
      !permissions.includes('read:RHEM') &&
      permissions.includes('read:NWERN')
    ){
      loginObj[ul]=process.env.NWERN
      loginObj[up]=process.env.NWERNP
      return new Pool(loginObj)
    } else if(
      permissions.includes('read:NDOW') &&
      permissions.includes('read:RHEM') &&
      !permissions.includes('read:NWERN')
    ){
      loginObj[ul]=process.env.NDOWRHEM
      loginObj[up]=process.env.NDOWRHEMP
      return new Pool(loginObj)
    }else if(
      permissions.includes('read:NDOW') &&
      !permissions.includes('read:RHEM') &&
      permissions.includes('read:NWERN')
    ){
      loginObj[ul]=process.env.NDOWNWERN
      loginObj[up]=process.env.NDOWNWERNP
      return new Pool(loginObj)
    } else if(
      !permissions.includes('read:NDOW') &&
      permissions.includes('read:RHEM') &&
      permissions.includes('read:NWERN')
    ){
      loginObj[ul]=process.env.RHEMNWERN
      loginObj[up]=process.env.RHEMNWERNP
      return new Pool(loginObj)
    } else if(
      permissions.includes('read:NDOW') &&
      permissions.includes('read:RHEM') &&
      permissions.includes('read:NWERN')
    ){
      loginObj[ul]=process.env.NDOWRHEMNWERN
      loginObj[up]=process.env.NDOWRHEMNWERNP
      return new Pool(loginObj)
    }
}

  

export {
        poolSelector
      }