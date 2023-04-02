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

export const accessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDE3MmEwYzU5MzFiOGIzNjM3ZDIwYTMiLCJlbWFpbCI6Im5paGFsbmludTI1QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6Ik5paGFsIiwibGFzdE5hbWUiOiJBYmR1bGxhIiwiY3JlYXRlZEF0IjoiMjAyMy0wMy0xOVQxNToyODoxMi4yODNaIiwidXBkYXRlZEF0IjoiMjAyMy0wMy0xOVQxNToyODoyNy4zNjlaIiwiX192IjowLCJpYXQiOjE2ODA0NDY2MDAsImV4cCI6MTY4MDQ0NzUwMH0.ekxBnZaTyjxCOCVNIM8o1u4mby0GnQ9dff13MUDhA48K69VqK4sipMvCr75ZFFhFWhLnrzRndTVEO8Rgwdz_d4zqzSj5qHgiMNcZk4szjGl8PglNuoycdUyyv9fzAM_8AMvuQXIMB2yYUSbFvMgOTwLFCPLeSjhUMcr4LZVNuCrj2N6uab7zTB_W-VJhj75XIdkBBNO9JRLAW-kWityfZlo_u5AHAj7G7_behUqYhf_TZF2e5lixEDUoch66MpSJkNNfFA3lSL4dhBbCGDpv3tzkPH8HmpQ7zLsbxnWn4-VezXRyWxO2H-OBDVyhDDPyA-BlEJH_fj4gVvI4PKB9gQ"