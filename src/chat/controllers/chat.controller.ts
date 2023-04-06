import WebSocketWithUserId from "../interfaces/webSocketWithUserId.interface";
import { CreateGroupMsg } from "../types/ws.createGroupMsg.type";
import { Msg } from "../types/msg.type";
import { LeaveGroupMsg } from "../types/ws.leaveGroupMsg.type";
import { JoinGroupMsg } from "../types/ws.joinGroupMsg.type";
import { SendMessageMsg } from "../types/ws.sendMessageMsg.type";
import { ChatService } from "../services/chat.service";
import { ChatRoom } from "../models/chatRoom.model";
import { DocumentType } from "@typegoose/typegoose";
import { PendingMessage } from "../models/pendingMessage.model";
import log from "../../utils/logger";
import { MongoServerError } from "mongodb";
import WebSocket from "ws";

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
                this.joinChatRoom(ws, msg.payload as JoinGroupMsg)
                break
            case "leave":
                this.leaveChatRoom(ws, msg.payload as LeaveGroupMsg)
                break
            case "create":
                this.createChatRoom(ws, msg.payload as CreateGroupMsg)
                break
            case "message":
                this.sendMessageToRoom(ws, msg.payload as SendMessageMsg)
                break
            default:
                break;
        }
    }

    public async createChatRoom(ws: WebSocketWithUserId, msg: CreateGroupMsg) {
        const input: ChatRoom = {
            chatInitiator: ws.userId,
            roomId: msg.roomId ?? crypto.randomUUID(),
            usersId: [ws.userId]
        }
        try {
            await this.chatService.createChatRoom(input);
            ws.send("Chat room created")
            return
        } catch (error) {
            const err = error as MongoServerError;
            log.error(err.message)
            if (err.code === 11000) {
                ws.send("Chat room already exists")
                return
            }
            ws.send(`ErrorCode: ${err.code}`)
        }
    }

    public joinChatRoom(ws: WebSocketWithUserId, msg: JoinGroupMsg) {
        this.chatService.joinChatRoom(msg.roomId, ws.userId);
        ws.send("Joined chat room")
    }

    public getAllChatRoomsByUserId(ws: WebSocketWithUserId) {
        // TODO
    }

    public async leaveChatRoom(ws: WebSocketWithUserId, msg: LeaveGroupMsg) {
        const chatRoom = await this.chatService.getChatRoomByRoomId(msg.roomId);
        if (!chatRoom) {
            ws.send("Chat room not found");
            return
        }
        if (chatRoom.chatInitiator === ws.userId) {
            this.chatService.deleteChatRoomById(msg.roomId);
            return ws.send("Chat room deleted");
        }
        this.chatService.leaveChatRoomById(msg.roomId, ws.userId);
        ws.send("Left chat room")
    }

    public async sendMessageToRoom(ws: WebSocketWithUserId, msg: SendMessageMsg) {
        const chatRoom: DocumentType<ChatRoom> | null = await this.chatService.getChatRoomByRoomId(msg.roomId);
        if (!chatRoom) {
            ws.send("Chat room not found")
            return
        }
        const usersList: string[] = chatRoom.usersId;
        usersList.forEach(userId => {
            if (this.isUserOnline(userId) && ws.userId !== userId) {
                this.sendMessageToUser(msg, userId)
            }
            this.sendMessageToOfflineUser(msg, userId)
        })
        ws.send("Message sent")
    }

    private isUserOnline(userId: string): boolean {
        const ws = this.webSocketConnections.get(userId);
        if (ws === undefined || ws.readyState !== WebSocket.OPEN) {
            return false;
        }
        return true;
    }

    private sendMessageToUser(msg: SendMessageMsg, userId: string) {
        const ws = this.webSocketConnections.get(userId)!;
        ws.send(msg.data)
    }

    private async sendMessageToOfflineUser(msg: SendMessageMsg, userId: string) {
        const input: PendingMessage = {
            userId,
            message: {
                createdTime: Date.now().toString(),
                data: msg.data,
                roomId: msg.roomId,
                senderId: userId
            },
            isDelivered: false
        }
        const pendingMessage = await this.chatService.createPendingMessage(input);
    }
}