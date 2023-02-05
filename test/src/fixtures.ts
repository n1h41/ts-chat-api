import { mongoose } from "@typegoose/typegoose"
import UserModel from "../../src/auth/models/user.model"

export const userInput = {
  email: "nihalninu25@gmail.com",
  firstName: "Nihal",
  lastName: "Abdulla",
  password: "12345678",
  passwordConfirmation: "12345678"
}

const _id = new mongoose.Types.ObjectId().toString()

export const userPayload = new UserModel({
  id: _id,
  email: "nihalninu25@gmail.com",
  firstName: "Nihal",
  lastName: "Abdulla",
  password: "123",
  verified: true
})

export const loginInput = {
  email: "nihalninu25@gmail.com",
  password: "123"
}
