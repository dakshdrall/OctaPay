import { Router } from 'express'
import { createLoan, getLoans } from '../controllers/borrowController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', requireAuth, getLoans)
router.post('/', requireAuth, createLoan)

export default router
