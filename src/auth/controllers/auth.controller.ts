import { DocumentType } from "@typegoose/typegoose";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { CreateSessionInput } from "../schema/auth.schema";
import { signAccessToken, signRefreshToken } from "../services/auth.service";
import { findUserByEmail } from "../services/user.service";

export async function healthcheckHandler(req: Request, res: Response) {
  return res.sendStatus(201)
}

export async function createSessionHandler(req: Request<object, object, CreateSessionInput>, res: Response) {
  const message = "Invalid email or password"
  const {email, password} = req.body
  const user: DocumentType<User> | null = await findUserByEmail(email)

  if (!user) {
    return res.status(401).send(message)
  }
  if (!user.verified) {
    return res.send("Account is not verified")
  }
  if (!user.validatePassword(password)) {
    return res.status(401).send(message)
  }
  
  const accessToken = signAccessToken(user)

  const refreshToken = signRefreshToken()

  return res.send({accessToken, refreshToken})
}
