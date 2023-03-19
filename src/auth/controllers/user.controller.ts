import { Request, Response } from "express";
import { nanoid } from "nanoid";
import log from "../../utils/logger";
import sendMail from "../../utils/mailer";
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserByEmail, findUserById } from "../services/user.service";

export async function registerUserHandler(req: Request<object, object, CreateUserInput>, res: Response) {
  const body = req.body;
  try {
    const user = await createUser(body)
    await sendMail({
      from: 'nihalninu25@gmail.com',
      to: user.email,
      subject: "Verify you'r account",
      html: `
        <h1>Email confirmation</h1>
        <p>Verify you'r account by clicking <a href=http://localhost:3000/users/verify/${user._id}/${user.verificationCode}>here</a></p>
      `,
    }) 
    return res.send("User created successfully")
  } catch(e: any) {
    if (e.code === 11000) {
      return res.status(401).send("This user is already registered")
    }
    log.error(e)
    return res.status(401).send(e) }
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
  return res.status(401).send("Invalid link")
}

export async function forgotPasswordHandler(req: Request<object, object, ForgotPasswordInput>, res: Response) {
  const {email} = req.body
  const message = "If user is regitered with the given mail id, you will shortly recieve an email"
  const user =  await findUserByEmail(email)
  
  if (!user) {
    return res.status(401).send(message)
  }

  if (!user.verified) {
    return res.status(401).send("User is not verified")
  }

  const passwordResetCode = nanoid()
  user.passwordResetCode = passwordResetCode
  await user.save()
  await sendMail({
    from: "nihalninu25@gmail.com",
    to: email,
    subject: "Password Reset Code",
    text: `Password reset code: ${user.passwordResetCode}, Id: ${user.id}`,
  })
  log.info(`Password reset mail send to ${email}`)
  return res.send(message)
}

export async function resetPasswordHandler(req: Request<ResetPasswordInput["params"], object, ResetPasswordInput["body"]>, res: Response) {
  const { id, passwordResetCode } = req.params 
  const { password } = req.body
  const user = await findUserById(id)
  if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
    return res.status(401).send("Could not reset user password")
  }

  user.passwordResetCode = null
  user.password = password
  await user.save()
  return res.send("Account password updated successfully")
}
