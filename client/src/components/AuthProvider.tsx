import useAuth from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import Loading from "./Loading"

export default function AuthProvider({children}: {children: JSX.Element | JSX.Element[]}) {
    const { accessToken, refreshToken } = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    const verifyRefreshToken = async () => {
        try {
            await refreshToken()
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        !accessToken ? verifyRefreshToken() : setIsLoading(false)
    }, [])

    return (
        <>
            { isLoading ? <Loading /> : children }
        </>
    ) 
}