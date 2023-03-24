import { ValidationChain } from "express-validator";
import { ResultWithContext } from "express-validator/src/chain";

export interface IAuthenticationValidations {
    signupRequest: ValidationChain[] & {run: (req: Request) => Promise<ResultWithContext[]>}
    signinRequest: ValidationChain[] & {run: (req: Request) => Promise<ResultWithContext[]>}
}