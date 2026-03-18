import { Router } from 'express'
import { listTransactions } from '../controllers/transactionsController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', requireAuth, listTransactions)

export default router
