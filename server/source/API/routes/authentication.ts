import { Router } from 'express'
import Authentication from '../controllers/Authentication'
import { signUpRequestValidation } from '../validators/authentication'

const router = Router()

router.post(
    '/sign-up', 
    signUpRequestValidation, 
    Authentication.signUp
)

export default router