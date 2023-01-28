import { Request, Response } from "express";

export async function healthcheckHandler(req: Request, res: Response) {
  res.sendStatus(201)
}
