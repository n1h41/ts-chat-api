import { DocumentType, getModelForClass, index, modelOptions, mongoose, pre, prop, Severity } from "@typegoose/typegoose";
import argon2 from "argon2"
import { nanoid } from "nanoid";

export const privateFields = [
  "password",
  "_v",
  "verificationCode",
  "passwordResetCode",
  "verified"
]

@pre<User>('save', async function () {
  if (!this.isModified) {
    return;
  }
  const hash = await argon2.hash(this.password)
  this.password = hash
  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
@index({
  email: 1
})
export class User {
  @prop({ required: true, unique: true, lowercase: true })
  email: string

  @prop({ required: true })
  firstName: string

  @prop({ required: true })
  lastName: string

  @prop({ required: true })
  password: string

  @prop({ required: true, default: nanoid() })
  verificationCode: string

  @prop({})
  passwordResetCode: string | null

  @prop({ default: false })
  verified: boolean


  async validatePassword(this: DocumentType<User>, candidatePassword: string): Promise<boolean> {
    try {
      return await argon2.verify(this.password, candidatePassword)
    } catch (e) {
      console.log("Could not authenticate password")
      return false
    }
  }
}

const UserModel = getModelForClass(User)

export default UserModel
