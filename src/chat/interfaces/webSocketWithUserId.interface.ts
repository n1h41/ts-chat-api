import WebSocket from 'ws';

export default interface WebSocketWithUserId extends WebSocket {
    userId: string;
}