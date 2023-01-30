import {object, string, TypeOf} from 'zod'

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email is required"
    }),
    password: string({
      required_error: "Password is required"
    }).min(6, "Password should be of min 6 characters")
  })
})

export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"]
