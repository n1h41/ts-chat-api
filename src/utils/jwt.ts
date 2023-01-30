import jwt from 'jsonwebtoken'
import config from 'config'
import log from './logger'

export function signJwt(object: object, keyname: "accessTokenPrivateKey" | "refreshTokenPrivateKey", options: jwt.SignOptions) {
  const privateKey = Buffer.from(config.get<string>(keyname), "base64").toString("ascii")
  return jwt.sign(object, privateKey, {...(options && options), algorithm: "RS256" })
}

export function verifyJwt<T>(token: string, keyname: "accessTokenPublicKey" | "refreshTokenPublicKey"): T | null {
  const publicKey = Buffer.from(config.get<string>(keyname), "base64").toString("ascii")
  try {
    const decoded = jwt.verify(token, publicKey) as T
    return decoded;
  } catch(e) {
    log.error(e)
    return null
  }
}
