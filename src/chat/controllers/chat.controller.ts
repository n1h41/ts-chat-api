import { Request, Response } from "express"
import { createChatRoom, deleteChatRoomById, getAllChatRoomsByUserId, getChatRoomById, joinChatRoom, leaveChatRoomById } from "../services/chat.service"
import { ChatRoom } from "../models/chatRoom.model"
import { JoinChatRoomSchema, LeaveChatRoomSchema } from "../schema/chat.schema"
import { find } from "lodash"

export const chatController = {
    getAllChatRoomsByUserId: async (req: Request, res: Response) => {
        const chatRooms = await getAllChatRoomsByUserId(res.locals.user._id)
        res.send(JSON.stringify(chatRooms))
    },
    createChatRoom: async (req: Request, res: Response) => {
        const data: ChatRoom = {
            chatInitiator: res.locals.user._id,
            roomId: crypto.randomUUID(),
            usersId: [res.locals.user._id]
        }
        const chatRoom = await createChatRoom(data)
        res.send(chatRoom)
    },
    joinChatRoom: async (req: Request<object, object, JoinChatRoomSchema>, res: Response) => {
        const { roomId } = req.body
        const chatRoom = await joinChatRoom(roomId, res.locals.user._id)
        res.send(chatRoom)
    },
    leaveChatRoom: async (req: Request<object, object, LeaveChatRoomSchema>, res: Response) => {
        const { roomId } = req.body
        const chatRoom = await getChatRoomById(roomId)
        if (!chatRoom) {
            return res.status(401).send("Room doesn't exists")
        }
        if (chatRoom.chatInitiator === res.locals.user._id) {
            await deleteChatRoomById(roomId)
            return res.send("Room deleted successfully")
        }
        if (find(chatRoom.usersId, res.locals.user._id)) {
            await leaveChatRoomById(roomId, res.locals.user._id)
            return res.send("Room left successfully")
        }
        return res.status(401).send("You are not in the room")
    }
}