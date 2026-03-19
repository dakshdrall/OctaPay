import { Router } from 'express'
import {
  createLoan,
  getLoans,
  repayLoan,
} from '../controllers/borrowController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', requireAuth, getLoans)
router.post('/', requireAuth, createLoan)
router.post('/repay', requireAuth, repayLoan)

export default router
