import { Request } from "express"

export interface IResponse {
    message: string
    data: any
    error?: string
}

export interface ISignUp {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    birthDate: string
}

export interface ISignIn {
    email: string
    password: string
}

export interface IUser {
    _id: string
    username: string
    firstName: string
    lastName: string
    email: string
    password?: string
    birthDate?: string
    createdAt?: string
    isConfirmed?: boolean
    __v?: number
}

export interface IRequestUser {
    _id: string
    username: string
    firstName: string
    lastName: string
    email: string
    iat: number
    exp: number
}

export interface ICustomRequest extends Request {
    user?: IRequestUser
}