import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import useProtect from "@/hooks/useProtect";

export default function Dashboard() {
    const { isPageLoading } = useProtect()
   
    return isPageLoading 
        ? (
            <Loading />
        ) : (
            <Layout horizontalCenter={true} verticalCenter={true}>
                <div>
                     Dashboard
                </div>
            </Layout>
        )       
}