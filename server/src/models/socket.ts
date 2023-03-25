import { Server, Socket } from "socket.io"
import http from "http"

class SocketConfiguration {
    private io: Server
    private connections: any

    constructor(server: http.Server, clientURL: string) {
        this.io = new Server(server, { cors: { origin: clientURL } })
        console.log(clientURL)
        this.connections = {}

        this.main()
    }

    private main() {
        this.io.on('connection', (socket) => {
            socket.emit("connection")
            socket.on("set-credentials", (credentials: string) => {
                this.connections["$." + socket.id] = credentials 
            })

            this.rooms(socket)

            socket.on('disconnect', () => {
                delete this.connections["$." + socket.id]
            })
        })
    }

    private rooms(socket: Socket) {
        socket.on("rooms", () => {})
    }
}

export default SocketConfiguration