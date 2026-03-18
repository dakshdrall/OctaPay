import { Router } from 'express'
import { getWallet, createWallet } from '../controllers/walletController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', requireAuth, getWallet)
router.post('/', requireAuth, createWallet)

export default router
