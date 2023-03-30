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
    })
}

export type JoinChatRoomSchema = TypeOf<typeof chatSchema.joinChatRoomSchema>["body"];
export type LeaveChatRoomSchema = TypeOf<typeof chatSchema.leaveChatRoomSchema>["body"];