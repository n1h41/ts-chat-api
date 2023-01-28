import express from "express"
import { forgotPasswordHandler, registerUserHandler, verifyUserHandler } from "../controllers/user.controller"
import { createUserSchema, forgotPasswordSchema, verifyUserSchema } from "../schema/user.schema"
import validateResource from "../middlewares/validateResource"

const userRouter = express.Router()

userRouter.post('/users/register', validateResource(createUserSchema), registerUserHandler)

userRouter.post('/users/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler)

userRouter.post('/users/forgotpassword', validateResource(forgotPasswordSchema), forgotPasswordHandler)

export default userRouter
