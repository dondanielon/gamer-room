import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { IResponse, ICustomRequest, IRequestUser } from "../types";

dotenv.config();

export function verifyJWT(
    req: ICustomRequest,
    res: Response,
    next: NextFunction
) {
    const response: IResponse = {
        message: "",
        data: null,
    };
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        response.message = "unauthorized missig token";
        return res.status(401).json(response);
    }

    const token = authHeader.split(" ")[1];

    return jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
        (err, decoded) => {
            if (err) {
                response.message = "invalid token";
                return res.status(403).json(response);
            }

            req.user = decoded as IRequestUser;
            return next();
        }
    );
}
