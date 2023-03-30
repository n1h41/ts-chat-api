import express from "express";
import { chatController } from "../controllers/chat.controller";
import validateResource from "../../auth/middlewares/validateResource";
import { chatSchema } from "../schema/chat.schema";

const chat = express.Router();

chat.get("/all", chatController.getAllChatRoomsByUserId);

chat.post("/create", chatController.createChatRoom)

chat.post("/join", validateResource(chatSchema.joinChatRoomSchema), chatController.joinChatRoom)

chat.post("/leave", validateResource(chatSchema.leaveChatRoomSchema), chatController.leaveChatRoom)

export default chat;