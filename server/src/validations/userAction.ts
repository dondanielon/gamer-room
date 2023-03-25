import { checkSchema } from "express-validator"
import User from "../database/user.schema"
import Friendship from "../database/friendship.schema"
import { IUserActionsValidations } from "../types/validations"

export default function getValidations(): IUserActionsValidations  {
    return {
        sendFriendship: checkSchema({
            userId: {
                in: "params",
                custom: {
                    bail: true,
                    options: async (id) => {
                        try {
                            const user = await User.findById(id)
                            if (!user) throw new Error("invalid user id")
                        } catch (_error) {
                            throw new Error("invalid user id")
                        }
                    }
                }
            }
        }),
        acceptFriendship: checkSchema({
            friendshipId: {
                in: "params",
                custom: {
                    bail: true,
                    options: async (id, { req }) => {
                        try {
                            const friendship = await Friendship.findById(id)
                            if (!friendship) throw new Error("invalid friendship id")

                            if(friendship.receiver.toString() !== req.user._id || friendship.status !== "pending") {
                                throw new Error("you cannot accept friendship")
                            }
                            return true
                        } catch (error) {
                            if (error instanceof Error && error.message === "you cannot accept friendship") {
                                throw error
                            }
                            throw new Error("invalid friendship id")
                        }
                    }
                }
            }
        })
    }
}
