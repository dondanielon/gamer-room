import { Server } from "socket.io"
import http from "http"

class SocketConfiguration {
    private io: Server
    private connections: { [socketId: string]: string }

    constructor(server: http.Server, clientURL: string) {
        this.io = new Server(server, { cors: { origin: clientURL } })
        this.connections = {}
        this.main()
    }

    private main() {
        this.io.on('connection', (socket) => {
            console.log(`user connected: ${socket.id}`)
            this.io.emit("connection")
            socket.on("set-credentials", (credentials: string) => {
                this.connections["$." + socket.id] = credentials 

                socket.on("get-count", () => {
                    console.log(`sending count`)
                    socket.emit("send-count", this.connections)
                    console.log(this.connections)
                })
            })

            

            //SocketConfiguration.rooms(socket)

            socket.on('disconnect', () => {
                delete this.connections["$." + socket.id]
            })
        })
    }

    // private static rooms(_socket: Socket) {
    //     // socket.on("get-count", () => {
    //     //     socket.emit("send-count", connections)
    //     // })
    // }
}

export default SocketConfiguration