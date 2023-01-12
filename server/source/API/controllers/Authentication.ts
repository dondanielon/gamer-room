import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from '../../database/schemas/user'

dotenv.config()

interface SignUpI {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    birthDate: Date
}

class Authentication  {

    static async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const body: SignUpI = req.body
            const encryptedPassword = await Authentication.encryptPwd(body.password)

            const newUser = new User({
                username: body.username,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: encryptedPassword,
                birthDate: body.birthDate
            })

            await newUser.save()

            return res.status(201).json({ message: 'user created' })

        } catch (error) {
            return next(error)
        }
    }

    // private functions
    private static async encryptPwd(password: string) {
        try {
            const encryption = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS!))
            return encryption
        } catch (error) {
            throw error
        }
    }
}

export default Authentication