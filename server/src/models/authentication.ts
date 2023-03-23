import { Router } from "express"
import { ValidationChain, checkSchema } from "express-validator"
import { ResultWithContext } from "express-validator/src/chain"
import User from '../database/user.schema'

interface IAuthenticationValidations {
    signupRequest: ValidationChain[] & {run: (req: Request) => Promise<ResultWithContext[]>}
}

class AuthenticationRouter {
    public router: Router
    private validate: IAuthenticationValidations

    constructor() {
        this.router = Router()
        this.validate = this.setValidations()
        
        this.buildRoutes()
    }

    private buildRoutes() {
        this.router.post("/signup", this.validate.signupRequest, )
        this.router.post("/signin")
        this.router.get("/signout")
        this.router.get("/refresh")
    }

    private setValidations() {
        return {
            signupRequest: checkSchema({
                username: {
                    in: "body",
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
                    notEmpty: { errorMessage: "firstName is required", bail: true },
                    isString: { errorMessage: "invalid input type firstName", bail: true },
                },
                lastName: {
                    in: "body",
                    notEmpty: { errorMessage: "lastName is required", bail: true },
                    isString: { errorMessage: "invalid input type lastName", bail: true },
                },
                email: {
                    in: "body",
                    notEmpty: { errorMessage: "email is required", bail: true },
                    isString: { errorMessage: "invalid input type email", bail: true },
                    isEmail: { errorMessage: "invalid email", bail: true },
                    custom: {
                        bail: true,
                        options: async (email) => {
                            const user = await User.findOne({ email: email })
            
                            if (user) throw new Error("email already in use")
                            return true;
                        },
                    },
                }
            })
        }
    }
}

export default AuthenticationRouter