import { NextFunction } from "express";
import { IncomingMessage } from "http";

const checkSocketConnectionId = (client: WebSocket, req: IncomingMessage, next: NextFunction) => { 
    return next()
}

export default checkSocketConnectionId