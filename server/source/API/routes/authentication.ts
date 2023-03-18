import { Router } from 'express'
import Authentication from '../controllers/authentication'
import { signUpRequestValidation } from '../validations/authentication'

const router = Router()

router.post('/sign-up', signUpRequestValidation, Authentication.signUp)
router.post('/sign-in', Authentication.signIn)
router.get('/refresh', Authentication.handleRefreshToken)
router.get('/sign-out', Authentication.signOut)

export default router