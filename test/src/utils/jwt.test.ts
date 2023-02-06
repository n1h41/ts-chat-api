import dotenv from "dotenv"
dotenv.config()
import { signJwt, verifyJwt } from "../../../src/utils/jwt"
import config from "config"

describe("JWT", () => {
  let signedAT: string | undefined
  describe.skip("Accessing refresh token private and public keys", () => {
    describe("given trying to fetch the refresh token private key", () => {
      it("should return a string", () => {
        const rtprivateKey = config.get<string>("refreshTokenPrivateKey")
      })
    })
  })
  describe("Signing an object using jwt", () => {
    describe("given that valid arguments are given", () => {
      it("It should return a token in string format", () => {
        signedAT = signJwt( { user: "nihal" }, "refreshTokenPrivateKey", { expiresIn: "15m" } )
        expect(typeof signedAT).toBe('string')
      })
    })
  })
  describe("Verifying a signed token", () => {
    describe("given a valid payload", () => {
      it("should decode the payload and return the object", () => {
        const decodedAt: object | null = verifyJwt<object>(signedAT as string, "refreshTokenPublicKey")
        expect(decodedAt).toHaveProperty('user', 'nihal')
      })
    })
  })
})
