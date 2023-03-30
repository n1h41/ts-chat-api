import { Ref, getModelForClass, prop } from "@typegoose/typegoose";
import { User } from "../../auth/models/user.model";

export class ChatClient {
    @prop({ required: true })
    websocketId: string

    @prop({ required: true, ref: () => User, unique: true })
    user: Ref<User>
}

const ChatClientModel = getModelForClass(ChatClient)

export default ChatClientModel