import { NextFunction, Request, Response } from "express"
import { User } from "../models/user.model"

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user
  if (!user) {
    return res.sendStatus(403)
  }
  return next()
}

export default requireUser
