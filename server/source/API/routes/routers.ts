import { Router } from 'express'
import authenticationRouter from './authentication'

const router = Router()
router.use('/authentication', authenticationRouter)

export default router