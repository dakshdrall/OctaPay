import jwt from 'jsonwebtoken'
import prisma from '../prisma/client.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev'

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { wallet: true },
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      country: user.country,
      wallet: user.wallet,
    }

    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
