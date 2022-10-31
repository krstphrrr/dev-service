import {
  auth,
  requiredScopes,
  claimEquals,
  claimIncludes,
  claimCheck
} from 'express-oauth2-jwt-bearer';
import secrets from '../db/secrets'

export const authCheck = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  // jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  audience: process.env.AUTH0_AUDIENCE
})