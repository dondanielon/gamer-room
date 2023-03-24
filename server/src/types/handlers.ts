import { Request } from "express";

export interface ISignup {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate: string;
}

export interface ISignin {
    email: string;
    password: string;
}

export interface IUser {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    birthDate?: string;
    createdAt?: string;
    isConfirmed?: boolean;
    refreshToken?: string;
    __v?: number;
}

export interface IRequestUser {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    iat: number;
    exp: number;
}

export interface ICustomRequest extends Request {
    user?: IRequestUser;
}
