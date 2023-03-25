import express, { Application, NextFunction, Router, Response, Request } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookies from "cookie-parser"
import { databaseConnection } from "../database/config"
import AuthenticationRouter from "./authentication"
import jwt from "jsonwebtoken"
import { ICustomRequest, IRequestUser } from "../types/handlers"
import UserActionRouter from "./userAction"
import { Server as ioServer } from "socket.io"
import http from "http"
dotenv.config()

class Server {
    private app: Application
    private server: http.Server
    private PORT: number
    private path: string
    private apiVersion: string
    private io: ioServer

    constructor() {
        this.app = express()
        this.server = http.createServer(this.app)
        this.PORT = parseInt(process.env.PORT!) || 8080
        this.path = "/api"
        this.apiVersion = "/v1"
        this.io = new ioServer(this.server)

        this.dbConnection()
        this.middlewares()
        this.routers()
        this.sockets()
        this.errorHandlerMiddleware()
    }

    start() {
        this.app.listen(this.PORT, () => {
            console.log(`server started on port: ${this.PORT}`)
        })
    }

    private async dbConnection() {
        try {
            await databaseConnection()
        } catch (error) {
            this.handleInternalError(error)
        }
    }

    private middlewares() {
        this.app.use(
            cors({ credentials: true, origin: process.env.CLIENT_BASE_URL! })
        )
        this.app.use(express.json())
        this.app.use(cookies())
    }

    private routers() {
        const router = Router()
        const authRouter = new AuthenticationRouter()
        const userActionRouter = new UserActionRouter(this.verifyJsonWebToken)

        router.use('/authentication', authRouter.router)
        router.use('/user-action', userActionRouter.router)

        this.app.use(`${this.path}${this.apiVersion}`, router)
    }

    private sockets() {
        this.io.on('connection', (socket) => {
            // TODO: logic when user authenticate in client
            console.log("user connection")

            socket.on('disconnect', () => {
                console.log('user disconnected')
            })
        })
    }

    private verifyJsonWebToken(req: ICustomRequest, res: Response, next: NextFunction) {
        const authHeader = req.headers["authorization"]
        if (!authHeader) return res.sendStatus(401)

        const token = authHeader.split(" ")[1];
        return jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!,
            (err, decoded) => {
                if (err) return res.sendStatus(403)
    
                req.user = decoded as IRequestUser
                return next()
            }
        );
    }

    private errorHandlerMiddleware() {
        this.app.use(
            (err:Error, _req: Request , res: Response, _next:NextFunction): Response => {
                console.error(err)
                return res.status(500).json({message: err.message})
            }
        )
    }

    private handleInternalError(error: unknown) {
        console.error(error)
    }
}

export default Server
