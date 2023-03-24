"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class UserActionRouter {
    constructor(authMiddleware) {
        this.router = (0, express_1.Router)();
        this.protect = authMiddleware;
        this.buildRoutes();
    }
    buildRoutes() {
        this.router.post("/send-friend-request", this.protect, this.sendFriendRequestHandler);
    }
    sendFriendRequestHandler(req, res, next) {
        var _a;
        try {
            const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            return res.status(200).json(id);
        }
        catch (error) {
            return next();
        }
    }
}
exports.default = UserActionRouter;
