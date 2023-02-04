import supertest from "supertest"
import UserModel from "../../../../src/auth/models/user.model"
import * as UserService from "../../../../src/auth/services/user.service"
import createServer from "../../../../src/utils/server"
import { userInput, userPayload } from "../../fixtures"

const app = createServer()

describe.skip("User", () => {
  // User registration
  describe("given the username and password are valid", () => {
    it("should create a user", async () => {
      // ts-ignore
      const createUserMock = jest.spyOn(UserService, "createUser").mockReturnValueOnce(Promise.resolve(userPayload))
      const { text, statusCode } = await supertest(app).post("/users/register").send(userInput) 
      expect(statusCode).toBe(200)
      expect(text).toEqual("User created successfully")
      expect(createUserMock).toHaveBeenCalledWith(userInput)
    })
  })

  describe("given the password does not match", () => {
    it("should return a 401", async () => {
      const createUserMock = jest.spyOn(UserService, "createUser").mockReturnValueOnce(Promise.resolve(userPayload))
      const { statusCode } = await supertest(app).post("/users/register").send({...userInput, passwordConfirmation: 123}) 
      expect(statusCode).toBe(400)
      expect(createUserMock).not.toHaveBeenCalled()
    })
  })

  describe("given that the user service throws an error", () => {
    it("should handle the error gracefully", async () => {
      const createUserMock = jest.spyOn(UserService, "createUser").mockRejectedValueOnce({e: {code: 1100}} as any)
      const { statusCode } = await supertest(app).post("/users/register").send(userInput) 
      expect(statusCode).toBe(401)
      expect(createUserMock).not.toHaveBeenCalledWith()
    })
  })
})

describe("Verify account", () => {
  describe("given valid verficiation code and user id", () => {
    it("should 200", async () => {
      const findUserByIdMock = jest.spyOn(UserService, "findUserById").mockReturnValueOnce(Promise.resolve(new UserModel({verificationCode: "123"}))) 
      const userModelMock = jest.spyOn(UserModel, 'update').mockReturnValueOnce(Promise.resolve())
      const { text, statusCode } = await supertest(app).post('/users/verify/1111/123')
      expect(statusCode).toBe(200)
    })
  })
})

describe.skip("Forgot password route", () => {
  describe("given that the email is not present in input", () => {
    it("should return 401", async () => {
      const { statusCode } = await supertest(app).post("/users/forgotpassword").send()
      expect(statusCode).toBe(401)
    })
  })

  describe("given the user is not verified", () => {
    it("should return 401",async () => {
      const findUserByEmailMock = jest.spyOn(UserService, "findUserByEmail").mockReturnValueOnce(Promise.resolve(new UserModel())) 
      const { statusCode, text } = await supertest(app).post('/users/forgotpassword').send({email: "nihalninu25@gmail.com"})
      expect(statusCode).toBe(401)
      expect(text).toEqual("User is not verified")
      return
    })
  })
})
