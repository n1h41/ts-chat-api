import { verify } from "jsonwebtoken"
import { object, string, TypeOf } from "zod"

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "First name is required"
    }),
    lastName: string({
      required_error: "Last name is required"
    }),
    email: string({
      required_error: "Email is required"
    }),
    password: string({
      required_error: "Password is required"
    }).min(6, "Password should be of minimum 6 characters"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required"
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password does not match",
    path: ["passwordConfirmation"]
  })
})

export const verifyUserSchema = object({
  params: object({
    id: string({
      required_error: "Id is required",
    }),
    verificationCode: string({
      required_error: "Verification code is required"
    }),
  })
})

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required"
    }).email("Not a valid email")
  })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"]
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"]
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"]
