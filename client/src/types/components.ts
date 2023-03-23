export interface ChildrenProps {
    children: JSX.Element | JSX.Element[];
}

export interface LayoutProps extends ChildrenProps {
    horizontalCenter: boolean;
    verticalCenter: boolean;
}

export interface TextInputProps {
    placeholder: string;
    value?: string;
    name?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    icon: JSX.Element;
    type: "text" | "password";
    autoComplete?: "on" | "off";
}

export interface SignButtonProps {
    text: string;
    requestStatus: "idle" | "loading" | "succeeded" | "failed";
}
