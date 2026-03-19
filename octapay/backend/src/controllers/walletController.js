import prisma from '../prisma/client.js'
import { createStellarWallet } from '../stellar/wallet.js'
import { fundTestnetAccount } from '../stellar/friendbot.js'
import { encryptText } from '../utils/crypto.js'

export const getWallet = async (req, res, next) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user.id },
      select: {
        id: true,
        stellarPublicKey: true,
        balance: true,
        userId: true,
      },
    })

    res.json({ wallet })
  } catch (err) {
    next(err)
  }
}

export const createWallet = async (req, res, next) => {
  try {
    const existing = await prisma.wallet.findUnique({
      where: { userId: req.user.id },
    })
    if (existing) {
      return res.status(200).json({ wallet: existing })
    }

    const { publicKey, secret } = createStellarWallet()
    await fundTestnetAccount(publicKey)

    const encryptedSecret = encryptText(secret)
    const wallet = await prisma.wallet.create({
      data: {
        userId: req.user.id,
        stellarPublicKey: publicKey,
        encryptedSecretKey: encryptedSecret,
      },
      select: {
        id: true,
        stellarPublicKey: true,
        balance: true,
        userId: true,
      },
    })

    res.status(201).json({ wallet })
  } catch (err) {
    next(err)
  }
}
