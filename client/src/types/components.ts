import { IconType } from "react-icons"

export interface LayoutProps {
    children: JSX.Element | JSX.Element[],
    horizontalCenter: boolean,
    verticalCenter: boolean
}

export interface TextInputProps {
    placeholder: string
    value?: string
    name?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    icon: JSX.Element
    type: 'text' | 'password'
    autoComplete?: 'on' | 'off'
}