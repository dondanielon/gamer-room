import { checkSchema } from 'express-validator'

export const signUpRequestValidation = checkSchema({
    username: {
        in: 'body',
        notEmpty: { errorMessage: 'username is required', bail: true },
        isString: { errorMessage: 'invalid input type username', bail: true }
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
        isEmail: { errorMessage: 'invalid email', bail: true }
    }
})