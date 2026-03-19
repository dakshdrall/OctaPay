import { Router } from 'express'
import {
  listInvestments,
  createInvestment,
  withdrawInvestment,
} from '../controllers/investController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', requireAuth, listInvestments)
router.post('/', requireAuth, createInvestment)
router.post('/withdraw', requireAuth, withdrawInvestment)

export default router
