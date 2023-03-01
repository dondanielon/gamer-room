export interface SignUpI {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    birthDate: string
}

export interface ResponseI {
    message: string
    data: any
    error?: string
}