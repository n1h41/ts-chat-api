import ChatRoomModel, { ChatRoom } from "../models/chatRoom.model";
import PendingMessageModel, { PendingMessage } from "../models/pendingMessage.model";

export class ChatService {
    public getAllChatRoomsByUserId(userId: string) {
        return ChatRoomModel.find({ usersId: { $contains: userId } }).exec()
    }

    public createChatRoom(input: ChatRoom) {
        return ChatRoomModel.create(input)
    }

    public joinChatRoom(roomId: string, userId: string) {
        return ChatRoomModel.updateOne({ roomId }, { $addToSet: { usersId: userId } }).exec()
    }

    public leaveChatRoomById(roomId: string, userId: string) {
        return ChatRoomModel.updateOne({ roomId }, { $pull: { usersId: userId } }).exec()
    }

    public deleteChatRoomById(roomId: string) {
        return ChatRoomModel.deleteOne({ roomId }).exec()
    }

    public getChatRoomByRoomId(roomId: string) {
        return ChatRoomModel.findOne({ roomId }).exec()
    }

    public createPendingMessage(input: PendingMessage) {
        return PendingMessageModel.create(input)
    }
}