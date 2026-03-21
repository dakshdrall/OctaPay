import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import prisma from '../prisma/client.js'
import { createWallet } from '../stellar/wallet.js'
import { fundTestnetAccount } from '../stellar/friendbot.js'
import { encryptText } from '../utils/crypto.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev'
const JWT_EXPIRES_IN = '7d'

function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function sanitizeUser(user) {
  if (!user) return null
  const { passwordHash, ...rest } = user
  return rest
}

export const register = async (req, res, next) => {
  try {
    const { email, password, name, country } = req.body
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, name, and password are required' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          country: country || '',
        },
      })

      const { publicKey, secret } = createWallet()
      await fundTestnetAccount(publicKey)

      const encryptedSecret = encryptText(secret)
      await tx.wallet.create({
        data: {
          userId: user.id,
          stellarPublicKey: publicKey,
          encryptedSecretKey: encryptedSecret,
        },
      })

      return user
    })

    const token = createToken(result.id)
    res.status(201).json({ user: sanitizeUser(result), token })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = createToken(user.id)
    res.json({ user: sanitizeUser(user), token })
  } catch (err) {
    next(err)
  }
}

export const logout = async (req, res) => {
  // Stateless JWT; frontend should discard token.
  res.status(204).send()
}

export const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        wallet: {
          select: {
            id: true,
            stellarPublicKey: true,
            balance: true,
            userId: true,
          },
        },
      },
    })

    res.json({ user: sanitizeUser(user) })
  } catch (err) {
    next(err)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' })
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const hash = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } })

    res.json({ message: 'Password updated' })
  } catch (err) {
    next(err)
  }
}
