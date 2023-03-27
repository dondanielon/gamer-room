import useAuth from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import Loading from "./Loading"
import { ChildrenProps } from "@/types/components"

export default function AuthProvider(props: ChildrenProps) {
    const { accessToken, refreshToken, isUserLoggedIn, credentials } = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    const verifyRefreshToken = async () => {
        try {
            await refreshToken()
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        !accessToken || !isUserLoggedIn || !credentials
            ? verifyRefreshToken()
            : setIsLoading(false)
    }, []);

    return <>{isLoading ? <Loading /> : props.children}</>
}
