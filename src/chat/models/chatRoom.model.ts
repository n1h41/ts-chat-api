import { Severity, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class ChatRoom {
  @prop({ required: true })
  chatInitiator: string

  @prop({ required: true, unique: true })
  roomId: string

  @prop({ default: [], required: true })
  usersId: string[]
}

const ChatRoomModel = getModelForClass(ChatRoom)

export default ChatRoomModel