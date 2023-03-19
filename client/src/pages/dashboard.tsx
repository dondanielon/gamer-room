import Layout from "@/components/Layout";
import useProtect from "@/hooks/useProtect";


export default function Dashboard() {
    const { isPageLoading } = useProtect()
   
    return isPageLoading 
        ? (
            <Layout horizontalCenter={true} verticalCenter={true}>
                <div>
                     Loading
                </div>
            </Layout>
        ) : (
            <Layout horizontalCenter={true} verticalCenter={false}>
                <div>
                     Dashboard
                </div>
            </Layout>
        )       
}