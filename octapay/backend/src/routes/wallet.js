import { Router } from 'express'
import {
  getWallet,
  createWallet,
  getWalletBalance,
  getWalletTransactions,
  sendWalletUSDC,
  sendWalletXLM,
  getAllPublicKeys,
} from '../controllers/walletController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', requireAuth, getWallet)
router.post('/', requireAuth, createWallet)

router.get('/balance', requireAuth, getWalletBalance)
router.get('/transactions', requireAuth, getWalletTransactions)
router.post('/send', requireAuth, sendWalletUSDC)
router.post('/send-xlm', requireAuth, sendWalletXLM)
router.get('/public-keys', getAllPublicKeys)

export default router
