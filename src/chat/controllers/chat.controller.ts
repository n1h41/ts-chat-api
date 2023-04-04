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
        console.log(this.webSocketConnections)
    }

    public removeWebSocketConnection(ws: WebSocketWithUserId) {
        this.webSocketConnections.delete(ws.userId!);
        console.log(this.webSocketConnections)
    }

    public handleMessage(ws: WebSocket, msg: any) {
        // TODO
        switch (msg.type) {
            case "join":
                // TODO: Join a chat room
                this.joinChatRoom()
                break
            case "leave":
                // TODO: Leave a chat room
                this.leaveChatRoom()
                break
            case "create":
                // TODO: Create a chat room
                this.createChatRoom()
                break
            case "message":
                // TODO: Send a message to a chat room
                this.sendMessageToRoom()
                break
            case "getChatRooms":
                // TODO: Get all chat rooms by user ID
                this.getAllChatRoomsByUserId()
                break
            default:
                break;
        }
    }

    private createChatRoom() {
        // TODO
    }

    private joinChatRoom() {
        // TODO
    }

    private getAllChatRoomsByUserId() {
        // TODO
    }

    private leaveChatRoom() {
        // TODO
    }

    private sendMessageToRoom() {
        // TODO
    }
}