import { checkSchema } from "express-validator";
import User from "../database/user.schema"
import { IAuthenticationValidations } from "../types/validations";

export default function getValidations(): IAuthenticationValidations  {
    return {
        signupRequest: checkSchema({
            username: {
                // TODO: add validation for not allowing special characters in username
                in: "body",
                toLowerCase: true,
                trim: true,
                notEmpty: { errorMessage: "username is required", bail: true },
                isString: { errorMessage: "invalid input type username", bail: true },
                custom: {
                    bail: true,
                    options: async (username) => {
                        const user = await User.findOne({ username: username })
        
                        if (user) throw new Error("username already in use")
                        return true;
                    },
                },
            },
            firstName: {
                in: "body",
                trim: true,
                notEmpty: { errorMessage: "firstName is required", bail: true },
                isString: { errorMessage: "invalid input type firstName", bail: true },
            },
            lastName: {
                in: "body",
                trim: true,
                notEmpty: { errorMessage: "lastName is required", bail: true },
                isString: { errorMessage: "invalid input type lastName", bail: true },
            },
            email: {
                in: "body",
                trim: true,
                normalizeEmail: true,
                notEmpty: { errorMessage: "email is required", bail: true },
                isString: { errorMessage: "invalid input type email", bail: true },
                isEmail: { errorMessage: "invalid email", bail: true },
                custom: {
                    bail: true,
                    options: async (email) => {
                        const user = await User.findOne({ email: email })
        
                        if (user) throw new Error("email already in use")
                        return true
                    }
                }
            }
            // TODO: add validation in password to validate if contains upper case letter, lower case letter, 
            // number and is at least 8 characters
        }),
        signinRequest: checkSchema({
            email: {
                in: "body",
                notEmpty: { errorMessage: "email is required", bail: true },
                isString: { errorMessage: "invalid input type email", bail: true },
                isEmail: { errorMessage: "invalid email", bail: true }
            },
            password: {
                in: "body",
                notEmpty: { errorMessage: "password is required", bail: true },
                isString: { errorMessage: "invalid input type password", bail: true }
            }
        })
    }
}
