import supertest from "supertest"
import createServer from "../../../../src/utils/server"
import { loginInput, userPayload } from "../../fixtures"
import * as UserService from "../../../../src/auth/services/user.service"
import * as AuthService from "../../../../src/auth/services/auth.service"
import { User } from "../../../../src/auth/models/user.model"

const app = createServer()

describe.skip("Authentication", () => {
  describe("Create a session", () => {
    let findUserByEmailMock
    let validatePasswordMock
    beforeEach(() => {
      findUserByEmailMock = jest.spyOn(UserService, "findUserByEmail").mockReturnValueOnce(Promise.resolve(userPayload))
      validatePasswordMock = jest.spyOn(User.prototype, "validatePassword").mockReturnValueOnce(Promise.resolve(true))
    })
    describe("given invalid request", () => {
      it("should return 401", async () => {
        const {statusCode} = await supertest(app).post('/auth/createsession').send({...loginInput, password: 1})
        expect(statusCode).toBe(401)
      })
    })

    describe("given a valid request", () => {
      it("should create a session and return access and refresh tokens", async () => {
        const signAccessTokenMock = jest.spyOn(AuthService, "signAccessToken").mockReturnValueOnce("accessToken")
        const signRefreshTokenMock = jest.spyOn(AuthService, "signRefreshToken").mockReturnValueOnce(Promise.resolve("refreshToken"))
        const {statusCode, body} = await supertest(app).post('/auth/createsession').send({email: "nihalninu25@gmail.com", password:"12345678"})
        expect(body).toHaveProperty("accessToken", "accessToken")
      })
    })
  })
})
