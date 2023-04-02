import express from "express";
import validateResource from "../../auth/middlewares/validateResource";
import { chatSchema } from "../schema/chat.schema";
import { ChatController } from "../controllers/chat.controller";

const chat = express.Router()

const chatController = ChatController.Instance;

chat.get("/all", chatController.getAllChatRoomsByUserId);

chat.post("/create", chatController.createChatRoom)

chat.post("/join", validateResource(chatSchema.joinChatRoomSchema), chatController.joinChatRoom)

chat.post("/leave", validateResource(chatSchema.leaveChatRoomSchema), chatController.leaveChatRoom)

chat.post("/:roomId", validateResource(chatSchema.sendMessageToRoomSchema), chatController.sendMessageToRoom)

export default chat;