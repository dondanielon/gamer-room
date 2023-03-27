import { Request, Response, NextFunction } from "express";

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

export type AuthMiddleware = (req: ICustomRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>

interface LobbyConfig {
    gameMode: string
    hostGamerId: string
    hostPlatform: "PS" | "XBOX" | "PC"
}

export interface ILobbySettings {
    gameId: string
    config: LobbyConfig
}
