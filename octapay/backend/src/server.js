import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import walletRoutes from './routes/wallet.js'
import investRoutes from './routes/invest.js'
import borrowRoutes from './routes/borrow.js'
import transactionRoutes from './routes/transactions.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'OctaPay Backend' })
})

app.use('/api/auth', authRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/invest', investRoutes)
app.use('/api/borrow', borrowRoutes)
app.use('/api/transactions', transactionRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`OctaPay backend listening on http://localhost:${PORT}`)
})
