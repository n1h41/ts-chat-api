import { signJwt } from "../../utils/jwt";
import { omit } from 'lodash'
import { privateFields, User } from "../models/user.model";
import { DocumentType } from "@typegoose/typegoose";

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user, privateFields)
  const accessToken = signJwt(payload, "accessTokenPrivateKey", {expiresIn: "15m"})

  return accessToken
}

export function signRefreshToken(userId:) {
  return
}
