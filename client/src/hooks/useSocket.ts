import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { io } from "socket.io-client"

export default function useSocket() {
    const { credentials, isSocketConnected, setSocketStatus } = useAuth()
    const [socket, _setSocket] = useState(io("http://localhost:8080", { autoConnect: false}))

    const getUsersCount = () => {
        console.log(socket.connected)
        console.log("getUsersCounnt")
        socket.emit("get-count") 
    }

    const initConnection = () => {
        
        socket.connect()
        console.log(socket)
        socket.on("connection", (socket) => {
            socket.emit("set-credentials", credentials?._id)

            socket.on("send-count", (payload: any) => {
                console.log(payload)
            })
        })

        

        setSocketStatus(true)
    }

    const closeConnection = () => {
        if (!isSocketConnected) return

        if (socket) {
            socket.disconnect()
            setSocketStatus(false)
        } else {
            console.error("socket closure failed")
        }
    }

    return { isSocketConnected, closeConnection, getUsersCount, initConnection }
}