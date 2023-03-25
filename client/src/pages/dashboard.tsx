import DashboardLayout from "@/components/DashboardLayout"
import Loading from "@/components/Loading"
import useProtect from "@/hooks/useProtect"

export default function Dashboard() {
    const { isPageLoading } = useProtect()

    return isPageLoading ? (
        <Loading />
    ) : (
        <DashboardLayout horizontalCenter={true} verticalCenter={false}>
            <div>Dashboard</div>
        </DashboardLayout>
    )
}
