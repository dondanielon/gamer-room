import { Router, Response, NextFunction } from "express"
import { AuthMiddleware, ICustomRequest } from "../types/handlers"
import { createFriendship } from "../database/helpers"
import { IUserActionsValidations } from "../types/validations"
import getValidations from "../validations/userAction"
import { ValidationError, validationResult } from "express-validator"

class UserActionRouter {
    public router: Router
    private protect: AuthMiddleware
    private validate: IUserActionsValidations

    constructor(authMiddleware: AuthMiddleware) {
        this.router = Router()
        this.protect = authMiddleware
        this.validate = getValidations()
        this.buildRoutes()
    }

    private buildRoutes() {
        this.router.post(
            "/send-friend-request/:id", 
            this.protect, 
            this.validate.sendFriendRequest, 
            this.sendFriendRequestHandler
        )
    }

    private async sendFriendRequestHandler(req: ICustomRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req).formatWith(
                ({ msg, value }: ValidationError) => ({ error: msg, value: value })
            )
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

            const senderId = req.user?._id!
            const receiverId = req.params.id

            await createFriendship(senderId, receiverId)
            return res.sendStatus(200)
        } catch (error) {
            return next()
        }
    }
}

export default UserActionRouter