import style from "@/components/styles/DashboardMenu.module.scss"
import useSocket from "@/hooks/useSocket"
import { useState, useEffect } from "react"

export default function DashboardMenu() {
    const [list, setList] = useState<any>(null)
    const { getUsersCount, isSocketConnected } = useSocket()

    useEffect(() => {
    }, [list])

    return (
        <nav className={style.navigation}>
            <button onClick={() => {
                // getUsersCount()
                console.log(isSocketConnected)
            }}>TEST!!!!!!!!!!</button>
        </nav>
    )
}
