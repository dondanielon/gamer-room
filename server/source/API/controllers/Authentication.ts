import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationError } from 'express-validator'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { createUser, findUserByEmail, findUserWithRefreshToken } from '../../database/helpers'
import { ISignUp, ISignIn, IResponse, IUser } from '../../types'
import jwt from 'jsonwebtoken'

dotenv.config()

class Authentication  {

    public static async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req).formatWith(({ msg }: ValidationError) => msg)

            if (!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array() })
            }

            const body: ISignUp = req.body
            const encryptedPassword = await Authentication.encryptPassword(body.password)

            await createUser({
                username: body.username,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: encryptedPassword,
                birthDate: new Date(body.birthDate).toISOString()
            })

            const response: IResponse = {
                message: 'user created',
                data: null
            }

            // send email confirmation after sign up 

            return res.status(201).json(response)

        } catch (error) {
            return next(error)
        }
    }

    public static async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const body: ISignIn = req.body
            const user = await findUserByEmail(body.email)

            const response: IResponse = {
                message: '',
                data: null
            }

            if (!user) {
                response.message = 'email or password incorrect'
                return res.status(401).json(response)
            }

            const isPasswordValid = await bcrypt.compare(body.password, user.password)

            if (!isPasswordValid) {
                response.message = 'email or password incorrect'
                return res.status(401).json(response)
            }

            const accessToken = jwt.sign(
                Authentication.formatUserToPublic(user.toObject()), 
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: '60m' }
            )

            const refreshToken = jwt.sign(
                Authentication.formatUserToPublic(user.toObject()), 
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: '30d' }
            )

            res.cookie(
                'refreshToken', 
                refreshToken, 
                { 
                    httpOnly: true, 
                    maxAge: 30 * 24 * 60 * 60 * 1000, 
                    secure: true,
                    sameSite: 'none'
                }
            )
            user.refreshToken = refreshToken
            await user.save()

            response.message = 'user authenticated'
            response.data = accessToken

            return res.status(200).json(response)

        } catch (error) {
            return next(error)
        }
    }

    public static async signOut(req: Request, res: Response, next: NextFunction) {
        try {
            const cookies = req.cookies
            const response: IResponse = {
                message: '',
                data: null
            }

            if (!cookies?.refreshToken) {
                response.message = 'missing cookies'
                return res.status(400).json(response)
            }

            const refreshToken = cookies.refreshToken
            const user = await findUserWithRefreshToken(refreshToken)

            if (!user) {
                res.clearCookie(
                    'refreshToken', 
                    { 
                        httpOnly: true, 
                        secure: true,
                        sameSite: 'none'
                    }
                )

                response.message = 'unavailable refresh token'
                return res.status(404).json(response)
            }

            user.refreshToken = undefined
            await user.save()
            res.clearCookie(
                'refreshToken', 
                {  
                    httpOnly: true, 
                    secure: true,
                    sameSite: 'none'
                }
            )

            response.message = 'user signed out'
            return res.status(200).json(response)

        } catch (error) {
            return next(error)
        }
    }

    public static async handleRefreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const cookies = req.cookies
            const response: IResponse = {
                message: '',
                data: null
            }

            if (!cookies?.refreshToken) {
                response.message = 'unauthorized missing cookies'
                return res.status(401).json(response)
            }

            const refreshToken = cookies.refreshToken
            const user = await findUserWithRefreshToken(refreshToken)

            if (!user) {
                response.message = 'invalid refresh token'
                return res.status(403).json(response)
            }

            return jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET!,
                (err: jwt.VerifyErrors | null, decoded: any ) => {

                    if (err || user._id.toString() !== decoded._id) {
                        response.message = 'invalid refresh token'
                        return res.status(403).json(response)
                    }

                    const accessToken = jwt.sign(
                        Authentication.formatUserToPublic(user.toObject()), 
                        process.env.ACCESS_TOKEN_SECRET!,
                        { expiresIn: '60m' }
                    )

                    response.message = 'token refreshed'
                    response.data = accessToken

                    return res.status(200).json(response)
                }
            )

        } catch (error) {
            return next(error)
        }
    }

    // private functions for controllers

    private static async encryptPassword(password: string) {
        try {
            const encryption = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS!))
            return encryption

        } catch (error) {
            throw error
        }
    }

    private static formatUserToPublic(user: IUser) {
        delete user?.password
        delete user?.__v
        delete user?.createdAt
        delete user?.isConfirmed
        delete user?.birthDate

        return user
    }
}

export default Authentication