import TextInput from './TextInput'
import style from '@/components/styles/LoginForm.module.scss'
import { FaUserAstronaut } from 'react-icons/fa'
import { FaLock } from 'react-icons/fa'

export default function LoginForm() {
    return (
        <form className={style.form}>
            <TextInput 
                type="text"
                placeholder="Email address"
                icon={<FaUserAstronaut />}
            />
            <TextInput 
                type="password"
                placeholder="Password"
                icon={<FaLock />}
            />
        </form>
    )
}