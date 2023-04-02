import { Request, Response } from "express";
import WebSocketWithUserId from "../interfaces/webSocketWithUserId.interface";
import { WebSocket } from "ws";

export class ChatController {
    private webSocketConnections: Map<String, WebSocketWithUserId> = new Map<String, WebSocketWithUserId>();
    private static instance: ChatController;

    private constructor() { }

    public static get Instance() {
        if (!this.instance) {
            this.instance = new ChatController();
        }
        return this.instance
    }

    public addWebSocketConnection(ws: WebSocketWithUserId) {
        this.webSocketConnections.set(ws.userId!, ws);
    }

    public removeWebSocketConnection(ws: WebSocketWithUserId) {
        this.webSocketConnections.delete(ws.userId!);
    }

    public handleMessage(ws: WebSocket, msg: any) {
        // TODO
        switch (msg.type) {
            case "join":
                // TODO: Join a chat room
                break
            case "leave":
                // TODO: Leave a chat room
                break
            case "create":
                // TODO: Create a chat room
                break
            case "message":
                // TODO: Send a message to a chat room
                break
            default:
                break;
        }
    }

    public createChatRoom() {
        // TODO
    }

    public joinChatRoom() {
        // TODO
    }

    public getAllChatRoomsByUserId() {
        // TODO
    }

    public leaveChatRoom() {
        // TODO
    }

    public sendMessageToRoom() {
        // TODO
    }
}