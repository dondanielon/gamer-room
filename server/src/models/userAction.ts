import { Router, Response, NextFunction } from "express"
import { AuthMiddleware, ICustomRequest } from "../types/handlers"
import { createFriendship, getFriendList, friendshipResponse } from "../database/helpers"
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
            "/send-friendship/:userId", 
            this.protect, 
            this.validate.sendFriendship, 
            this.sendFriendshipHandler
        )
        this.router.get(
            "/get-friend-list",
            this.protect,
            this.getFriendListHandler
        )
        this.router.put(
            "/friendship-response/:friendshipId",
            this.protect,
            this.validate.friendshipResponse,
            this.friendshipResponseHandler
        )
    }

    private async sendFriendshipHandler(req: ICustomRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req).formatWith(
                ({ msg, value }: ValidationError) => ({ error: msg, value: value })
            )
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

            const senderId = req.user?._id!
            const receiverId = req.params.userId

            await createFriendship(senderId, receiverId)
            return res.sendStatus(200)
        } catch (error) {
            return next(error)
        }
    }

    private async getFriendListHandler(req: ICustomRequest, res: Response, next: NextFunction) {
        try {
            const id = req.user?._id!
            const friendList = await getFriendList(id)

            return res.status(200).json(friendList)
        } catch (error) {
            return next(error)
        }
    }

    private async friendshipResponseHandler(req: ICustomRequest, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req).formatWith(
                ({ msg, value }: ValidationError) => ({ error: msg, value: value })
            )
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

            const friendshipId = req.params.friendshipId
            const status = req.body.status
            await friendshipResponse(friendshipId, status)

            return res.sendStatus(200)
        } catch (error) {
            return next(error)
        }
    }
}

export default UserActionRouter