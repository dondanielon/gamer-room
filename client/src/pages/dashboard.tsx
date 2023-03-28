import DashboardLayout from "@/components/DashboardLayout"
import Loading from "@/components/Loading"
import useProtect from "@/hooks/useProtect"
import useSocket from "@/hooks/useSocket"
import { useEffect } from "react"

export default function Dashboard() {
    const { isPageLoading } = useProtect()
    const { isSocketConnected, closeConnection, initConnection } = useSocket()

    useEffect(() => {
        if (!isPageLoading && !isSocketConnected) {
            
            initConnection()
            console.log(isSocketConnected)
        }

        return () => {
            if (isSocketConnected) closeConnection()
        }
    }, [isPageLoading])

    return isPageLoading ? (
        <Loading />
    ) : (
        <DashboardLayout horizontalCenter={true} verticalCenter={false}>
            <div
            style={{
                backgroundColor: "#2a2b31",
                borderRadius: "5px",
                height: "1800px",
                minWidth: "750px"
            }}
            >Dashboard</div>
        </DashboardLayout>
    )
}
