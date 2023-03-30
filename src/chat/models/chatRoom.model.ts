import { getModelForClass, prop } from '@typegoose/typegoose'

export class ChatRoom {
  @prop({ required: true })
    chatInitiator: string

  @prop({ required: true, unique: true })
    roomId: string 

  @prop({default: [], required: true})
    usersId: string[]
}

const ChatRoomModel = getModelForClass(ChatRoom)

export default ChatRoomModel