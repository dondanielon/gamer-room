import Layout from "@/components/Layout" 
import Loading from "@/components/Loading"
import LoginForm from "@/components/LoginForm"
import useAuth from "@/hooks/useAuth"
import style from '@/pages/styles/login.module.scss'
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

export default function Login() {
    const router = useRouter()
    const { isUserLoggedIn, accessToken, credentials } = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (isUserLoggedIn && accessToken && credentials) {
            router.push('/dashboard')
        } else {
            setIsLoading(false)
        }
    }, [])

    return isLoading ? (
        <Loading />
    ) : (
        <Layout horizontalCenter={true} verticalCenter={true}>
            <div className={style.container}>
                <LoginForm />
            </div>
        </Layout>
    )
}