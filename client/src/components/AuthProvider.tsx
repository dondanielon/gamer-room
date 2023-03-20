import useAuth from "@/hooks/useAuth"
import useRefreshToken from "@/hooks/useRefreshToken"
import { useEffect, useState } from "react"
import Loading from "./Loading"

export default function AuthProvider({children}: {children: JSX.Element | JSX.Element[]}) {
    const { accessToken, setAuthStatus } = useAuth()
    const refresh = useRefreshToken()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh()
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        !accessToken ? verifyRefreshToken() : setIsLoading(false)
    }, [])

    useEffect(() => {
        if (accessToken) setAuthStatus(true)
    }, [accessToken])

    return (
        <>
            { isLoading ? <Loading /> : children }
        </>
    ) 
}