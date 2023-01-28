import { Request, Response } from "express";
import log from "../../utils/logger";
import sendMail from "../../utils/mailer";
import { CreateUserInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserById } from "../services/user.service";

export async function registerUserHandler(req: Request<object, object, CreateUserInput>, res: Response) {
  const body = req.body;
  try {
    const user = await createUser(body)
    sendMail({
      from: 'nihalninu25@gmail.com',
      to: user.email,
      subject: "Please verify your account",
      text: `verification code ${user.verificationCode}, Id: ${user._id}`
    }) 
    return res.send("User created successfully")
  } catch(e: any) {
    if (e.code === 11000) {
      return res.status(401).send("This user is already registered")
    }
    log.error(e)
    return res.status(401).send(e)
  }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
  const { id, verificationCode } = req.params
  const user = await findUserById(id)
  if (!user) {
    return res.status(401).send("User doesn't exits")
  }
  if (user.verified) {
    return res.status(401).send("User already verified")
  }
  if (verificationCode === user.verificationCode) {
    user.verified = true
    await user.save()
    return res.send("User verified successfully")
  }
  return res.send("Invalid link")
}
