"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importStar(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("../database/config");
const authentication_1 = __importDefault(require("./authentication"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.PORT = parseInt(process.env.PORT) || 8080;
        this.path = "/api";
        this.apiVersion = "/v1";
        this.dbConnection();
        this.middlewares();
        this.routers();
        this.errorHandlerMiddleware();
    }
    start() {
        this.app.listen(this.PORT, () => {
            console.log(`server started on port: ${this.PORT}`);
        });
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, config_1.databaseConnection)();
            }
            catch (error) {
                this.handleInternalError(error);
            }
        });
    }
    middlewares() {
        this.app.use((0, cors_1.default)({ credentials: true, origin: process.env.CLIENT_BASE_URL }));
        this.app.use(express_1.default.json());
        this.app.use((0, cookie_parser_1.default)());
    }
    routers() {
        const router = (0, express_1.Router)();
        const authRouter = new authentication_1.default();
        router.use('/authentication', authRouter.router);
        this.app.use(`${this.path}${this.apiVersion}`, router);
    }
    verifyJsonWebToken(req, res, next) {
        const authHeader = req.headers["authorization"];
        if (!authHeader)
            return res.sendStatus(401);
        const token = authHeader.split(" ")[1];
        return jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err)
                return res.sendStatus(403);
            req.user = decoded;
            return next();
        });
    }
    errorHandlerMiddleware() {
        this.app.use((err, _req, res, _next) => {
            console.error(err);
            if (err.message === 'unknown')
                console.log(this.verifyJsonWebToken);
            return res.status(500).json({ message: err.message });
        });
    }
    handleInternalError(error) {
        console.error(error);
    }
}
exports.default = Server;
