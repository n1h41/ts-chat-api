import express from "express"
import { registerUserHandler, verifyUserHandler } from "../controllers/user.controller"
import { createUserSchema, verifyUserSchema } from "../schema/user.schema"
import validateResource from "../middlewares/validateResource"

const userRouter = express.Router()

userRouter.post('/user/register', validateResource(createUserSchema), registerUserHandler)

userRouter.post('/user/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler)

export default userRouter
