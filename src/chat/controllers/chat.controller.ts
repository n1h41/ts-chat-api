import WebSocketWithUserId from "../interfaces/webSocketWithUserId.interface";
import { CreateGroupMsg } from "../types/ws.createGroupMsg.type";
import { Msg } from "../types/msg.type";
import { LeaveGroupMsg } from "../types/ws.leaveGroupMsg.type";
import { JoinGroupMsg } from "../types/ws.joinGroupMsg.type";
import { SendMessageMsg } from "../types/ws.sendMessageMsg.type";
import { ChatService } from "../services/chat.service";
import { ChatRoom } from "../models/chatRoom.model";
import { DocumentType } from "@typegoose/typegoose";

export class ChatController {
    private webSocketConnections: Map<String, WebSocketWithUserId> = new Map<String, WebSocketWithUserId>();
    private static instance: ChatController;

    private constructor(
        private chatService: ChatService
    ) { }

    public static get Instance() {
        if (!this.instance) {
            this.instance = new ChatController(new ChatService());
        }
        return this.instance
    }

    public addWebSocketConnection(ws: WebSocketWithUserId) {
        this.webSocketConnections.set(ws.userId!, ws);
    }

    public removeWebSocketConnection(ws: WebSocketWithUserId) {
        this.webSocketConnections.delete(ws.userId!);
    }

    public handleMessage(ws: WebSocketWithUserId, msg: Msg) {
        switch (msg.type) {
            case "join":
                this.joinChatRoom(ws, msg.message as JoinGroupMsg)
                break
            case "leave":
                this.leaveChatRoom(ws, msg.message as LeaveGroupMsg)
                break
            case "create":
                this.createChatRoom(ws, msg.message as CreateGroupMsg)
                break
            case "message":
                this.sendMessageToRoom(ws, msg.message as SendMessageMsg)
                break
            default:
                break;
        }
    }

    public createChatRoom(ws: WebSocketWithUserId, msg: CreateGroupMsg) {
        const input: ChatRoom = {
            chatInitiator: ws.userId,
            roomId: crypto.randomUUID(),
            usersId: [ws.userId]
        }
        this.chatService.createChatRoom(input);
    }

    public joinChatRoom(ws: WebSocketWithUserId, msg: JoinGroupMsg) {
        this.chatService.joinChatRoom(msg.roomId, ws.userId);
    }

    public getAllChatRoomsByUserId(ws: WebSocketWithUserId) {
        // TODO
    }

    public leaveChatRoom(ws: WebSocketWithUserId, msg: LeaveGroupMsg) {
        this.chatService.leaveChatRoomById(msg.roomId, ws.userId);
    }

    public async sendMessageToRoom(ws: WebSocketWithUserId, msg: SendMessageMsg) {
        const chatRoom: DocumentType<ChatRoom> | null = await this.chatService.getChatRoomByRoomId(msg.roomId);
        if (!chatRoom) {
            ws.emit("Chat room not found")
            return
        }
        const usersList: string[] = chatRoom.usersId;
        usersList.forEach(userId => {
            if (this.isUserOnline(userId)) {
                this.sendMessageToUser(msg, userId)
            }
            // TODO: logic to send message to offline users
        })
    }

    private isUserOnline(userId: string): boolean {
        const ws = this.webSocketConnections.get(userId);
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            return false;
        }
        return true;
    }

    private sendMessageToUser(msg: SendMessageMsg, userId: string) {
        const ws = this.webSocketConnections.get(userId)!;
        ws.emit(msg.data)
    }
}