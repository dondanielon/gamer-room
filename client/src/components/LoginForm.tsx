import TextInput from './TextInput'
import style from '@/components/styles/LoginForm.module.scss'
import { useEffect, useState } from 'react'
import { FaUserAstronaut } from 'react-icons/fa'
import { FaLock } from 'react-icons/fa'
import { useRouter } from 'next/router'
import useAuth from '@/hooks/useAuth'
import SignButton from './SignButton'

export default function LoginForm() {
    const router = useRouter()
    const { signInState, redirectAfterSignIn, signIn } = useAuth()
    
    const [input, setInput] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (signInState.status !== 'loading') {
            signIn(input)
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // checar el campo
        setInput({
            ...input,
            [event.target.name]: event.target.value
        })
    }
    
    useEffect(() => {
        if(signInState.status === 'succeeded') {
            if (redirectAfterSignIn) {
                router.push(redirectAfterSignIn)
            } else {
                router.push('/dashboard')
            }
        }
    }, [signInState.status])

    return (
        <form className={style.form} onSubmit={handleSubmit}>
            <TextInput 
                type='text'
                placeholder='Email address'
                icon={<FaUserAstronaut />}
                value={input.email}
                name='email'
                onChange={handleInputChange}
            />
            <TextInput 
                type='password'
                placeholder='Password'
                icon={<FaLock />}
                value={input.password}
                name='password'
                onChange={handleInputChange}
            />
            <SignButton 
                text='Sign In'
                requestStatus={signInState.status}
            />
        </form>
    )
}