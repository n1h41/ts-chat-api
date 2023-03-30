import { prop } from '@typegoose/typegoose'

export class ChatMessage{
  @prop({ required: true })
    sender: string

  @prop({ required: true })
    data: string
}
