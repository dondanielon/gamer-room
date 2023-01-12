import { Router } from 'express'
import Authentication from '../controllers/Authentication'

const router = Router()

router.post('/sign-up', Authentication.signUp)

export default router