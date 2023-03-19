import express from "express"
import { forgotPasswordHandler, registerUserHandler, resetPasswordHandler, verifyUserHandler } from "../controllers/user.controller"
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from "../schema/user.schema"
import validateResource from "../middlewares/validateResource"

const user = express.Router()

user.post('/users/register', validateResource(createUserSchema), registerUserHandler)

user.get('/users/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler)

user.post('/users/forgotpassword', validateResource(forgotPasswordSchema), forgotPasswordHandler)

user.post('/users/resetpassword/:id/:passwordResetCode', validateResource(resetPasswordSchema), resetPasswordHandler)

export default user
