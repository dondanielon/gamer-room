import { SignButtonProps } from "@/types/components";
import { RotatingLines } from  'react-loader-spinner'
import style from '@/components/styles/SignButton.module.scss'

export default function SignButton(props: SignButtonProps) {
    return props.requestStatus === 'loading' ? (
        <button className={style.main}>
            <RotatingLines 
                width='30'
                strokeColor="#d0d0d0"
                strokeWidth="3"
                animationDuration="1"
            />
        </button>
    ) : (
        <button className={style.main} type='submit'>
            {props.text}
        </button>
    )
}