import { TextInputProps } from "@/types/components"
import style from '@/components/styles/TextInput.module.scss'

export default function TextInput(props: TextInputProps) {
    return (
        <div className={style.main}>
            <div className={style.icon}>
                {props.icon}
            </div>
            <input
                type={props.type}
                className={style.input}
                placeholder={props.placeholder}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                autoComplete={props.autoComplete ? props.autoComplete : 'off'}
            />
        </div>
    )
}