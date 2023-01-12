import { checkSchema } from 'express-validator'

export const signUpRequestValidation = checkSchema({
    username: {
        in: 'body',
        notEmpty: {
            errorMessage: 'username is required',
            bail: true
        },
        isString: {
            errorMessage: 'invalid input type',
            bail: true
        }
    }
})