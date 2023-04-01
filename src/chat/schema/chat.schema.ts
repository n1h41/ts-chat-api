import { TypeOf, object, string } from "zod";

export const chatSchema = {
    joinChatRoomSchema: object({
        body: object({
            roomId: string({
                required_error: "Room id is required"
            })
        })
    }),
    leaveChatRoomSchema: object({
        body: object({
            roomId: string({
                required_error: "Room id is required"
            })
        })
    }),
    sendMessageToRoomSchema: object({
        body: object({
            data: string({
                required_error: "Message data is required"
            })
        }),
        params: object({
            roomId: string({
                required_error: "Room id is required to send message"
            })
        })
    })
}

export type JoinChatRoomSchema = TypeOf<typeof chatSchema.joinChatRoomSchema>["body"];
export type LeaveChatRoomSchema = TypeOf<typeof chatSchema.leaveChatRoomSchema>["body"];
export type SendMessageToRoomSchema = TypeOf<typeof chatSchema.sendMessageToRoomSchema>