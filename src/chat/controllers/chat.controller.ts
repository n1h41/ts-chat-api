import { Request, Response } from "express"
import { createChatRoom, deleteChatRoomById, getAllChatRoomsByUserId, getChatRoomByRoomId, isUserOnline, joinChatRoom, leaveChatRoomById, sendMessage } from "../services/chat.service"
import { ChatRoom } from "../models/chatRoom.model"
import { JoinChatRoomSchema, LeaveChatRoomSchema, SendMessageToRoomSchema } from "../schema/chat.schema"
import { includes } from "lodash"
import { ChatMessage } from "../types/chatMessage.type"

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
        const { userId } = res.locals.user._id
        const chatRoom = await getChatRoomByRoomId(roomId)
        if (!chatRoom) {
            return res.status(401).send("Room doesn't exists")
        }
        if (chatRoom.chatInitiator === userId) {
            await deleteChatRoomById(roomId)
            return res.send("Room deleted successfully")
        }
        if (includes(chatRoom.usersId, userId)) {
            await leaveChatRoomById(roomId, userId)
            return res.send("Room left successfully")
        }
        return res.status(401).send("You are not in the room")
    },
    sendMessageToRoom: async (req: Request<SendMessageToRoomSchema["params"], object, SendMessageToRoomSchema["body"]>, res: Response) => {
        /*
        Logic to send message to a room
            1. Check whether the room exist or not
            2. Check whether the user is in the room
            3. Get the list of userId's in the room
            4. Send message to other users in the room
        */
        const { roomId } = req.params
        const { data } = req.body
        const { userId } = res.locals.user._id
        const chatRoom = await getChatRoomByRoomId(roomId)
        if (!chatRoom) {
            return res.status(401).send("Chat room doesn't exits")
        }
        if (!includes(chatRoom.usersId, userId)) {
            return res.status(401).send("User is not part of the chat room")
        }
        const users = chatRoom.usersId
        const message: ChatMessage = {
            data,
            senderId: userId,
            createdTime: new Date().toISOString(),
            roomId: roomId
        }
        users.forEach(user => {
            if (!isUserOnline(user)) {
                // * Logic to send message to offline users
            }
            sendMessage(user, message)
        })
    }
}