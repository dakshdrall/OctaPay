import { Router } from 'express'
import { register, login, logout, me, changePassword } from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', requireAuth, logout)
router.get('/me', requireAuth, me)
router.post('/change-password', requireAuth, changePassword)

export default router
