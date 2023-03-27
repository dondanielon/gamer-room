import { Server, Socket } from "socket.io"
import http from "http"
import { ILobbySettings } from "../types/handlers"

class SocketConfiguration {
    private io: Server
    private connections: any
    private lobbiesPerGame: any

    constructor(server: http.Server, clientURL: string) {
        this.io = new Server(server, { cors: { origin: clientURL } })
        console.log(clientURL)
        this.connections = {}
        this.lobbiesPerGame = {}

        this.main()
    }

    private main() {
        this.io.on('connection', (socket: Socket) => {
            socket.emit("connection")
            // authenticate connection to save connected user socket id as this.connections property
            // with user _id as value
            socket.on("set-credentials", (credentials: string) => {
                this.connections["$." + socket.id] = credentials 
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
}

export default SocketConfiguration