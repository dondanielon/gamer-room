import { checkSchema } from "express-validator";
import User from "../database/user.schema"
import { IUserActionsValidations } from "../types/validations";

export default function getValidations(): IUserActionsValidations  {
    return {
        sendFriendRequest: checkSchema({
            id: {
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
                    },
                },
            }
        })
    }
}
