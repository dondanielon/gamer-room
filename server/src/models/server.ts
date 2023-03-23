import express, { Application } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookies from "cookie-parser"
import { databaseConnection } from "../database/config"
dotenv.config()

class Server {
    private app: Application
    private PORT: number
    private path: string
    private apiVersion: string

    constructor() {
        this.app = express()
        this.PORT = parseInt(process.env.PORT!) || 8080
        this.path = "/api"
        this.apiVersion = "/v1"

        this.dbConnection()
        this.attachMiddlewares()
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

    private attachMiddlewares() {
        this.app.use(
            cors({ credentials: true, origin: process.env.CLIENT_BASE_URL! })
        )
        this.app.use(express.json())
        this.app.use(cookies())
    }

    private handleInternalError(error: unknown) {
        console.log(error)
    }
}

export default Server
