import { Server } from "socket.io"
import http from "http"
import { ILobbySettings } from "../types/handlers"

class SocketConfiguration {
    private io: Server
    private connections: any
    private lobbiesPerGame: any

    constructor(server: http.Server, clientURL: string) {
        this.io = new Server(server, { cors: { origin: clientURL } })
        this.connections = {}
        this.lobbiesPerGame = {}

        this.main()
    }

    private main() {
        this.io.on('connection', (socket) => {
            socket.emit("connection")
            // authenticate connection to save connected user socket id as this.connections property
            // with user _id as value
            socket.on("set-credentials", (credentials: string) => {
                this.connections["$." + socket.id] = credentials 

                socket.on("get-count", () => {
                    console.log(`sending count`)
                    socket.emit("send-count", this.connections)
                    console.log(this.connections)
                })
            })
            // socket to manage lobbies posts
            socket.on("post-lobby", (lobbySettings: ILobbySettings ) => {
                this.lobbiesPerGame[lobbySettings.gameId][socket.id] = lobbySettings.config
                socket.emit("refresh-lobbies")
            })

            
            // delete user from this.connections 
            socket.on('disconnect', () => {
                delete this.connections["$." + socket.id]
            })
        })
    }
    
    print() {
        console.log(this.connections)
        console.log(this.lobbiesPerGame)
    }
}

export default SocketConfiguration