import { ValidationChain } from "express-validator";
import { ResultWithContext } from "express-validator/src/chain";

export interface IAuthenticationValidations {
    signupRequest: ValidationChain[] & {run: (req: Request) => Promise<ResultWithContext[]>}
    signinRequest: ValidationChain[] & {run: (req: Request) => Promise<ResultWithContext[]>}
}

export interface IUserActionsValidations {
    sendFriendship: ValidationChain[] & {run: (req: Request) => Promise<ResultWithContext[]>}
    friendshipResponse: ValidationChain[] & {run: (req: Request) => Promise<ResultWithContext[]>}
    deleteFriendship: ValidationChain[] & {run: (req: Request) => Promise<ResultWithContext[]>}
    findUsername: ValidationChain[] & {run: (req: Request) => Promise<ResultWithContext[]>}
}