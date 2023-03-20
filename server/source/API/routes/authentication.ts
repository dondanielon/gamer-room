import { Router } from 'express'
import { signUpRequestValidation } from '../validations/authentication'
import Authentication from '../controllers/Authentication'
import { verifyJWT } from '../middlewares'

const router = Router()

router.post('/sign-up', signUpRequestValidation, Authentication.signUp)
router.post('/sign-in', Authentication.signIn)
router.get('/refresh', Authentication.handleRefreshToken)
router.get('/sign-out', Authentication.signOut)

router.get('/test', verifyJWT, Authentication.test)

export default router