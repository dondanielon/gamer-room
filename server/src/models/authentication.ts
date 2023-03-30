import { Router, NextFunction, Response, Request } from "express"
import { validationResult, ValidationError } from "express-validator"
import { ISignin, ISignup, IUser } from "../types/handlers"
import { createUser, findUserByEmail, findUserWithRefreshToken, createUserSocials } from "../database/helpers"
import { IAuthenticationValidations } from "../types/validations"
import getValidations from "../validations/authentication"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

class AuthenticationRouter {
    public router: Router
    private validate: IAuthenticationValidations

    constructor() {
        this.router = Router()
        this.validate = getValidations()
        
        this.buildRoutes()
    }

    private buildRoutes() {
        this.router.post(
            "/signup", 
            this.validate.signupRequest, 
            this.signupHandler
        )
        this.router.post(
            "/signin", 
            this.validate.signinRequest, 
            this.signinHandler
        )
        this.router.get("/signout", this.signoutHandler)
        this.router.get("/refresh", this.refreshHandler)
    }

    private async signupHandler(req: Request, res: Response, next: NextFunction){
        try {
            const errors = validationResult(req).formatWith(
                ({ msg, value }: ValidationError) => ({ error: msg, value: value })
            )
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
            
            const body: ISignup = req.body;
            const encryptedPassword = await AuthenticationRouter.encryptPassword(
                body.password
            )
            const userId = await createUser({
                ...body,
                password: encryptedPassword,
                birthDate: new Date(body.birthDate).toISOString()
                
            })

            await createUserSocials(userId)
            // TODO: send email with url that validates email set by user

            return res.sendStatus(201)
        } catch (error) {
            return next(error)
        }
    }

    private async signoutHandler(req: Request, res: Response, next: NextFunction){
        try {
            const cookies = req.cookies;
            if (!cookies?.refreshToken) return res.sendStatus(400)
            
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })
            const refreshToken = cookies.refreshToken;
            const user = await findUserWithRefreshToken(refreshToken);
            if (!user) return res.sendStatus(404)

            user.refreshToken = undefined
            await user.save()

            return res.sendStatus(200)
        } catch (error) {
            return next(error);
        }
    }

    private async signinHandler(req: Request, res: Response, next: NextFunction){
        try {
            const body: ISignin = req.body;
            const user = await findUserByEmail(body.email)
            if (!user) return res.sendStatus(401)

            const isPasswordValid = await bcrypt.compare(
                body.password,
                user.password
            )
            if (!isPasswordValid) return res.sendStatus(401)

            const accessToken = jwt.sign(
                AuthenticationRouter.formatUserToPublic(user.toObject()),
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: "365d" }
            )
            const refreshToken = jwt.sign(
                AuthenticationRouter.formatUserToPublic(user.toObject()),
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: "365d" }
            )
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 365 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "none",
            })
            user.refreshToken = refreshToken;
            await user.save();

            return res.status(200).json({
                accessToken: accessToken,
                credentials: AuthenticationRouter.formatUserToPublic(user.toObject())
            })     
        } catch (error) {
            return next(error);
        }
    }

    private async refreshHandler(req: Request, res: Response, next: NextFunction){
        try {
            const cookies = req.cookies;
            if (!cookies?.refreshToken) return res.sendStatus(401)
        
            const refreshToken = cookies.refreshToken;
            const user = await findUserWithRefreshToken(refreshToken);
            if (!user) {
                return res.sendStatus(403)
            }
            
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET!,
                async (err: jwt.VerifyErrors | null, decoded: any) => {
                    if (err || user._id.toString() !== decoded._id) {
                        user.refreshToken = undefined
                        await user.save()

                        return res.sendStatus(403)
                    }

                    const accessToken = jwt.sign(
                        AuthenticationRouter.formatUserToPublic(user.toObject()),
                        process.env.ACCESS_TOKEN_SECRET!,
                        { expiresIn: "365d" }
                    )
                    return res.status(200).json({
                        accessToken: accessToken,
                        credentials: decoded
                    })     
                }
            );
        } catch (error) {
            return next(error);
        }
    }

    private static async encryptPassword(password: string) {
        try {
            const encryption = await bcrypt.hash(
                password,
                parseInt(process.env.BCRYPT_SALT_ROUNDS!)
            );
            return encryption;
        } catch (error) {
            throw error;
        }
    }

    private static formatUserToPublic(user: IUser) {
        delete user?.password;
        delete user?.__v;
        delete user?.createdAt;
        delete user?.isConfirmed;
        delete user?.birthDate;
        delete user?.refreshToken;

        return user;
    }
}

export default AuthenticationRouter