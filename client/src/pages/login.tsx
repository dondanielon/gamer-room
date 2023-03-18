import Layout from "@/components/Layout"
import LoginForm from "@/components/LoginForm"
import style from '@/pages/styles/login.module.scss'

export default function Login() {
    return (
        <Layout horizontalCenter={true} verticalCenter={true}>
            <div className={style.container}>
                <LoginForm />
            </div>
        </Layout>
    )
}