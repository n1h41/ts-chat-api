import ChatRoomModel, { ChatRoom } from "../models/chatRoom.model";
import { ChatMessage } from "../types/chatMessage.type";

export function getAllChatRoomsByUserId(userId: string) {
    return ChatRoomModel.find({ usersId: { $contains: userId } }).exec()
}

export function createChatRoom(input: ChatRoom) {
    return ChatRoomModel.create(input)
}

export function joinChatRoom(roomId: string, userId: string) {
    return ChatRoomModel.updateOne({ roomId }, { $push: { usersId: userId } }).exec()
}

export function leaveChatRoomById(roomId: string, userId: string) {
    return ChatRoomModel.updateOne({ roomId }, { $pull: { usersId: userId } }).exec()
}

export function deleteChatRoomById(roomId: string) {
    return ChatRoomModel.deleteOne({ roomId }).exec()
}

export function getChatRoomByRoomId(roomId: string) {
    return ChatRoomModel.findOne({ roomId }).exec()
}