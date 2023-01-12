import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationError } from 'express-validator'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { createUser } from '../../database/helpers'
import { SignUpI } from '../../types'

dotenv.config()

class Authentication  {

    public static async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req).formatWith(({ msg }: ValidationError) => msg )

            if (!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array() })
            }

            const body: SignUpI = req.body
            const encryptedPassword = await Authentication.encryptPwd(body.password)

            const response = createUser({
                username: body.username,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                password: encryptedPassword,
                birthDate: body.birthDate
            })

            // falta implementar logica para enviar un correo de confirmacion

            return res.status(201).json(response)

        } catch (error) {
            return next(error)
        }
    }

    // funciones privadas usadas en los controladores publicos

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