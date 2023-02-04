import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateResource = (z: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    z.parse({
      body: req.body,
      params: req.params,
      query: req.query
    })
    next();
  } catch(e: any) {
    res.status(401).send(e.errors)
  }
}

export default validateResource
