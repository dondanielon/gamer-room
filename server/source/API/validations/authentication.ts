import { checkSchema } from 'express-validator'
import User from '../../database/schemas/user'

export const signUpRequestValidation = checkSchema({
    username: {
        in: 'body',
        notEmpty: { errorMessage: 'username is required', bail: true },
        isString: { errorMessage: 'invalid input type username', bail: true },
        custom: {
            bail: true,
            options: async (username) => {
                const user = await User.findOne({ username: username })

                if (user) throw new Error('username already in use');
                return true
            }
        }
    },
    firstName: {
        in: 'body',
        notEmpty: { errorMessage: 'firstName is required', bail: true },
        isString: { errorMessage: 'invalid input type firstName', bail: true }
    },
    lastName: {
        in: 'body',
        notEmpty: { errorMessage: 'lastName is required', bail: true },
        isString: { errorMessage: 'invalid input type lastName', bail: true }
    },
    email: {
        in: 'body',
        notEmpty: { errorMessage: 'email is required', bail: true },
        isString: { errorMessage: 'invalid input type email', bail: true },
        isEmail: { errorMessage: 'invalid email', bail: true },
        custom: {
            bail: true,
            options: async (email) => {
                const user = await User.findOne({ email: email })

                if (user) throw new Error('email already in use');
                return true
            }
        }
    }
})