"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const helpers_1 = require("../database/helpers");
const authentication_1 = __importDefault(require("../validations/authentication"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
class AuthenticationRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.validate = (0, authentication_1.default)();
        this.buildRoutes();
    }
    buildRoutes() {
        this.router.post("/signup", this.validate.signupRequest, this.signupHandler);
        this.router.post("/signin", this.validate.signinRequest, this.signinHandler);
        this.router.get("/signout", this.signoutHandler);
        this.router.get("/refresh", this.refreshHandler);
    }
    signupHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req).formatWith(({ msg }) => msg);
                if (!errors.isEmpty())
                    return res.status(400).json({ errors: errors.array() });
                const body = req.body;
                const encryptedPassword = yield AuthenticationRouter.encryptPassword(body.password);
                yield (0, helpers_1.createUser)({
                    username: body.username,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    email: body.email,
                    password: encryptedPassword,
                    birthDate: new Date(body.birthDate).toISOString()
                });
                return res.sendStatus(201);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    signoutHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cookies = req.cookies;
                if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken))
                    return res.sendStatus(400);
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                });
                const refreshToken = cookies.refreshToken;
                const user = yield (0, helpers_1.findUserWithRefreshToken)(refreshToken);
                if (!user)
                    return res.sendStatus(404);
                user.refreshToken = undefined;
                yield user.save();
                return res.sendStatus(200);
            }
            catch (error) {
                return next(error);
            }
        });
    }
    signinHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const user = yield (0, helpers_1.findUserByEmail)(body.email);
                if (!user)
                    return res.sendStatus(401);
                const isPasswordValid = yield bcrypt_1.default.compare(body.password, user.password);
                if (!isPasswordValid)
                    return res.sendStatus(401);
                const accessToken = jsonwebtoken_1.default.sign(AuthenticationRouter.formatUserToPublic(user.toObject()), process.env.ACCESS_TOKEN_SECRET, { expiresIn: "365d" });
                const refreshToken = jsonwebtoken_1.default.sign(AuthenticationRouter.formatUserToPublic(user.toObject()), process.env.REFRESH_TOKEN_SECRET, { expiresIn: "365d" });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    maxAge: 365 * 24 * 60 * 60 * 1000,
                    secure: true,
                    sameSite: "none",
                });
                user.refreshToken = refreshToken;
                yield user.save();
                return res.status(200).json({
                    accessToken: accessToken,
                    credentials: AuthenticationRouter.formatUserToPublic(user.toObject())
                });
            }
            catch (error) {
                return next(error);
            }
        });
    }
    refreshHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cookies = req.cookies;
                if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken))
                    return res.sendStatus(401);
                const refreshToken = cookies.refreshToken;
                const user = yield (0, helpers_1.findUserWithRefreshToken)(refreshToken);
                if (!user) {
                    return res.sendStatus(403);
                }
                jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err || user._id.toString() !== decoded._id) {
                        user.refreshToken = undefined;
                        yield user.save();
                        return res.sendStatus(403);
                    }
                    const accessToken = jsonwebtoken_1.default.sign(AuthenticationRouter.formatUserToPublic(user.toObject()), process.env.ACCESS_TOKEN_SECRET, { expiresIn: "365d" });
                    return res.status(200).json({
                        accessToken: accessToken,
                        credentials: decoded
                    });
                }));
            }
            catch (error) {
                return next(error);
            }
        });
    }
    static encryptPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const encryption = yield bcrypt_1.default.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
                return encryption;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static formatUserToPublic(user) {
        user === null || user === void 0 ? true : delete user.password;
        user === null || user === void 0 ? true : delete user.__v;
        user === null || user === void 0 ? true : delete user.createdAt;
        user === null || user === void 0 ? true : delete user.isConfirmed;
        user === null || user === void 0 ? true : delete user.birthDate;
        user === null || user === void 0 ? true : delete user.refreshToken;
        return user;
    }
}
exports.default = AuthenticationRouter;
