import { getModelForClass, prop } from "@typegoose/typegoose";
import { ChatMessage } from "../types/chatMessage.type";

export class PendingMessage {
    @prop({ required: true })
    userId: string;

    @prop({ required: true })
    message: ChatMessage

    @prop({ required: true, default: false })
    isDelivered: boolean
}

const PendingMessageModel = getModelForClass(PendingMessage)

export default PendingMessageModel