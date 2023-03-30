import ChatClientModel, { ChatClient } from "../models/chatClient.model";
import ChatRoomModel, { ChatRoom } from "../models/chatRoom.model";

export function createChatClient(input: ChatClient) {
    return ChatClientModel.create(input)
}

export function findChatClientByUserId(userId: string) {
    return ChatClientModel.findOne({ user: userId }).exec()
}

export function updateChatClient(id: string, socketId: string) {
    return ChatClientModel.updateOne({ _id: id }, { websocketId: socketId }).exec()
}

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

export function getChatRoomById(roomId: string) {
    return ChatRoomModel.findOne({ roomId }).exec()
}