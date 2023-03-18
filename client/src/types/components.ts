import { IconType } from "react-icons"

export interface LayoutProps {
    children: JSX.Element | JSX.Element[],
    horizontalCenter: boolean,
    verticalCenter: boolean
}

export interface TextInputProps {
    placeholder: string
    icon: JSX.Element
    type: 'text' | 'password'
}