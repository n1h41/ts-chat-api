import dotenv from "dotenv"
dotenv.config()
import { signJwt, verifyJwt } from "../../../src/utils/jwt"

describe("JWT", () => {
  let signedAT: string | undefined
  describe("Signing an object using jwt", () => {
    describe("given that valid arguments are given", () => {
      it("It should return a token in string format", () => {
        signedAT = signJwt( { user: "nihal" }, "accessTokenPrivateKey", { expiresIn: "15m" } )
        expect(typeof signedAT).toBe('string')
      })
    })
  })
  describe("Verifying a signed token", () => {
    describe("given a valid payload", () => {
      it("should decode the payload and return the object", () => {
        const decodedAt: object | null = verifyJwt<object>(signedAT as string, "accessTokenPublicKey")
        expect(decodedAt).toHaveProperty('user', 'nihal')
      })
    })
  })
})
