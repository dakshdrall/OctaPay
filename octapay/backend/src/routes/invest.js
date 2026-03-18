import { Router } from 'express'
import { listInvestments, createInvestment } from '../controllers/investController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', requireAuth, listInvestments)
router.post('/', requireAuth, createInvestment)

export default router
