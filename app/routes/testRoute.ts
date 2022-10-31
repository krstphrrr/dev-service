import express from 'express'
import * as testController from '../controllers/testController'
import { authCheck } from "../middleware/auth"

import {
  claimCheck,
  JWTPayload,
  requiredScopes
} from 'express-oauth2-jwt-bearer';
import { linkCreator, newpackager } from '../controllers/newpackager';

interface Claim extends JWTPayload {
  permissions: string[]
}



const router = express.Router()

// no auth test
// router.put('/test', testController.newcreateData)

//  direct download link 
router.get('/files/download/:uuid', testController.getData)

router.get('/files/exists/:uuid', testController.fileExists)

// download page route (returned from created db entry)
router.get('/files/:uuid', testController.showData)

// development route that downloads with authentication.
// authorization is not implemented.
router.put('/download-data', testController.createData)

////////////////////////////////////////////////////////
// START of routes with authentication + authorization

router.put('/unrestricted', 
        // authCheck = auth function of the express-oauth2-jwt-bearer package
        // docs = https://auth0.github.io/node-oauth2-jwt-bearer/index.html#auth
        authCheck, 
        
        // claimCheck: function of the express-oauth2-jwt-bearer package that 
        //             checks claims(properties inside of the JWTPayload object) on a token
        // docs = https://auth0.github.io/node-oauth2-jwt-bearer/index.html#claimcheck
        claimCheck((claim:Claim)=>{
          return (
            !claim.permissions.includes('read:NWERN') && 
            !claim.permissions.includes('read:NDOW') &&
            !claim.permissions.includes('read:RHEM')
          ) // returns true if all the permissions are absent
        }),
        // testController.createData
        (req,res,next)=>{
          res.locals.test = linkCreator()
          console.log("grrrr")
          next()
        }
        );

router.put('/unrestricted',
        authCheck, 
        claimCheck((claim:Claim)=>{
          return (
            !claim.permissions.includes('read:NWERN') && 
            !claim.permissions.includes('read:NDOW') &&
            !claim.permissions.includes('read:RHEM')
          ) // returns true if all the permissions are absent
        }),
        // testController.createData,
        async (req, res, next)=>{
          const informationObject = await res.locals.test
          console.log(informationObject)
          testController.createData(req,res, next)
          res.status(200).json({"informationObj":informationObject})
        }
)


// NDOW BLOCK
router.put('/ndow', 
        authCheck, 
        requiredScopes('read:NDOW'),
        claimCheck((claim:Claim)=>{
          return (
            !claim.permissions.includes('read:NWERN') && 
            claim.permissions.includes('read:NDOW') &&
            !claim.permissions.includes('read:RHEM')
          )
        }),
        (req,res,next)=>{
          res.locals.test = linkCreator()
          next()
        }
);

router.put('/ndow', 
          authCheck, 
          requiredScopes('read:NDOW'),
          claimCheck((claim:Claim)=>{
            return (
              !claim.permissions.includes('read:NWERN') && 
              claim.permissions.includes('read:NDOW') &&
              !claim.permissions.includes('read:RHEM')
            )
          }),
          async (req, res, next)=>{
            const informationObject = await res.locals.test
            testController.createData(req,res, next)
            res.status(200).json({"informationObj":informationObject})
          }
);

// NWERN BLOCK
router.put('/nwern', 
        authCheck, 
        requiredScopes('read:NWERN'),
        claimCheck((claim:Claim)=>{
          return (
            claim.permissions.includes('read:NWERN') && 
            !claim.permissions.includes('read:NDOW') &&
            !claim.permissions.includes('read:RHEM')
          )
        }),
        (req,res,next)=>{
          res.locals.test = linkCreator()
          next()
        }
);

router.put('/nwern', 
        authCheck, 
        requiredScopes('read:NWERN'),
        claimCheck((claim:Claim)=>{
          return (
            claim.permissions.includes('read:NWERN') && 
            !claim.permissions.includes('read:NDOW') &&
            !claim.permissions.includes('read:RHEM')
          )
        }),
        async (req, res, next)=>{
          const informationObject = await res.locals.test
          testController.createData(req,res, next)
          res.status(200).json({"informationObj":informationObject})
        }
);

// RHEM BLOCK
router.put('/rhem', 
        authCheck, 
        requiredScopes('read:RHEM'),
        claimCheck((claim:Claim)=>{
          return (
            !claim.permissions.includes('read:NWERN') && 
            !claim.permissions.includes('read:NDOW') &&
            claim.permissions.includes('read:RHEM')
          )
        }),
        (req,res,next)=>{
          res.locals.test = linkCreator()
          next()
        }
);


router.put('/rhem', 
        authCheck, 
        requiredScopes('read:RHEM'),
        claimCheck((claim:Claim)=>{
          return (
            !claim.permissions.includes('read:NWERN') && 
            !claim.permissions.includes('read:NDOW') &&
            claim.permissions.includes('read:RHEM')
          )
        }),
        async (req, res, next)=>{
          const informationObject = await res.locals.test
          testController.createData(req,res, next)
          res.status(200).json({"informationObj":informationObject})
        }
);


// NDOW NWERN BLOCK
router.put('/ndow-nwern', 
        authCheck, 
        requiredScopes('read:NDOW read:NWERN'),
        claimCheck((claim:Claim)=>{
          return (
            claim.permissions.includes('read:NWERN') && 
            claim.permissions.includes('read:NDOW') &&
            !claim.permissions.includes('read:RHEM')
          )
        }),
        (req,res,next)=>{
          res.locals.test = linkCreator()
          next()
        }
);

router.put('/ndow-nwern', 
        authCheck, 
        requiredScopes('read:NDOW read:NWERN'),
        claimCheck((claim:Claim)=>{
          return (
            claim.permissions.includes('read:NWERN') && 
            claim.permissions.includes('read:NDOW') &&
            !claim.permissions.includes('read:RHEM')
          )
        }),
        async (req, res, next)=>{
          const informationObject = await res.locals.test
          testController.createData(req,res, next)
          res.status(200).json({"informationObj":informationObject})
        }
);

// NDOW RHEM BLOCK
router.put('/ndow-rhem', 
        authCheck, 
        requiredScopes('read:NDOW read:RHEM'),
        claimCheck((claim:Claim)=>{
          return (
            !claim.permissions.includes('read:NWERN') && 
            claim.permissions.includes('read:NDOW') &&
            claim.permissions.includes('read:RHEM')
          )
        }),
        (req,res,next)=>{
          res.locals.test = linkCreator()
          next()
        }
);

router.put('/nwern-rhem', 
        authCheck, 
        requiredScopes('read:NWERN read:RHEM'),
        claimCheck((claim:Claim)=>{
          return (
            !claim.permissions.includes('read:NWERN') && 
            claim.permissions.includes('read:NDOW') &&
            claim.permissions.includes('read:RHEM')
          )
        }),
        async (req, res, next)=>{
          const informationObject = await res.locals.test
          testController.createData(req,res, next)
          res.status(200).json({"informationObj":informationObject})
        }
);


// NDOW NWERN RHEM BLOCK
router.put('/ndow-nwern-rhem', 
        authCheck, 
        requiredScopes('read:NDOW read:NWERN read:RHEM'),
        claimCheck((claim:Claim)=>{
          return (
            claim.permissions.includes('read:NWERN') && 
            claim.permissions.includes('read:NDOW') &&
            claim.permissions.includes('read:RHEM')
          )
        }),
        (req,res,next)=>{
          res.locals.test = linkCreator()
          next()
        }
);

router.put('/ndow-nwern-rhem', 
        authCheck, 
        requiredScopes('read:NDOW read:NWERN read:RHEM'),
        claimCheck((claim:Claim)=>{
          return (
            claim.permissions.includes('read:NWERN') && 
            claim.permissions.includes('read:NDOW') &&
            claim.permissions.includes('read:RHEM')
          )
        }),
        async (req, res, next)=>{
          const informationObject = await res.locals.test
          testController.createData(req,res, next)
          res.status(200).json({"informationObj":informationObject})
        }
);


export default router