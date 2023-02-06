import { signJwt } from "../../utils/jwt";
import { omit } from 'lodash'
import { privateFields, User } from "../models/user.model";
import { DocumentType } from "@typegoose/typegoose";
import { Session, SessionModel } from "../models/session.model";

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields)
  const accessToken = signJwt(payload, "accessTokenPrivateKey", {expiresIn: "15m"})

  return accessToken
}

export function createSession(userId: string) {
  return SessionModel.create({ user: userId })
}

export async function signRefreshToken(userId: string) {
  const session: DocumentType<Session> = await createSession(userId)
  const refreshToken: string | undefined = signJwt({session: session._id}, "refreshTokenPrivateKey", {expiresIn: "1y"})
  return refreshToken
}

export function findSessionById(id: string) {
  return SessionModel.findById(id)
}
