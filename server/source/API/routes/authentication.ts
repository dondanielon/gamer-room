import { Router } from 'express'
import Authentication from '../controllers/authentication'
import { signUpRequestValidation } from '../validations/authentication'

const router = Router()

router.post('/sign-up', signUpRequestValidation, Authentication.signUp)

export default router