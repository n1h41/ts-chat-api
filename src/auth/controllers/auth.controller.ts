import { DocumentType } from "@typegoose/typegoose";
import { Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../../utils/jwt";
import { Session } from "../models/session.model";
import { User } from "../models/user.model";
import { CreateSessionInput } from "../schema/auth.schema";
import { findSessionById, signAccessToken, signRefreshToken } from "../services/auth.service";
import { findUserByEmail, findUserById } from "../services/user.service";

export async function healthcheckHandler(_req: Request, res: Response) {
  return res.sendStatus(201)
}

export async function createSessionHandler(req: Request<object, object, CreateSessionInput>, res: Response) {
  const message = "Invalid email or password"
  const {email, password} = req.body
  const user: DocumentType<User> | null = await findUserByEmail(email)

  if (!user) {
    return res.status(402).send(message)
  }
  if (!user.verified) {
    return res.status(401).send("Account is not verified")
  }
  if (!user.validatePassword(password)) {
    return res.status(404).send(message)
  }
  
  const accessToken = signAccessToken(user)

  const refreshToken = signRefreshToken(user._id)

  return res.send({accessToken, refreshToken})
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const message = "Could no refresh access token"
  const refreshToken: string = get(req, "headers.x-refresh") as string
  const decoded = verifyJwt<{session: string}>(refreshToken, "refreshTokenPublicKey")
  if (!decoded) {
    return res.status(401).send(message)
  }
  const session: DocumentType<Session> | null = await findSessionById(decoded.session)

  if (!session?.valid) {
    return res.status(401).send(message)
  }
  
  const user = await findUserById(String(session.user))

  if (!user) {
    return res.status(401).send(message)
  }

  const accessToken = signAccessToken(user)

  return res.send(accessToken)
}
