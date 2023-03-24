import { Router, Response, NextFunction } from "express"
import { AuthMiddleware, ICustomRequest } from "../types/handlers"
//import { IAuthenticationValidations } from "../types/validations"

class UserActionRouter {
    public router: Router
    private protect: AuthMiddleware
    //private validate: IAuthenticationValidations

    constructor(authMiddleware: AuthMiddleware) {
        this.router = Router()
        this.protect = authMiddleware
        this.buildRoutes()
    }

    private buildRoutes() {
        this.router.post("/send-friend-request", this.protect, this.sendFriendRequestHandler)
    }

    private sendFriendRequestHandler(req: ICustomRequest, res: Response, next: NextFunction) {
        try {
            const id = req.user?._id!
            return res.status(200).json(id)
        } catch (error) {
            return next()
        }
    }
}

export default UserActionRouter