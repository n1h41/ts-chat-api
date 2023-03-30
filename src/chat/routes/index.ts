import express, { Response } from "express";
import requireUser from "../../auth/middlewares/requireUser";
import chat from "./chat.routes";

const chatRoutes = express.Router();

chatRoutes.get('/healthcheck', (_, res: Response) => {
    return res.sendStatus(201)
})

chatRoutes.use(requireUser)
chatRoutes.use(chat)

export default chatRoutes