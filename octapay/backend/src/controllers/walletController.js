import prisma from '../prisma/client.js'
import { createWallet, getBalance, fundWallet } from '../stellar/wallet.js'
import { getAccountTransactions, sendUSDC } from '../stellar/transactions.js'
import { encryptText, decryptText } from '../utils/crypto.js'

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

    const { publicKey, secret } = await createWallet({ initialUsdc: 50 })
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

export const getWalletBalance = async (req, res, next) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user.id },
    })
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' })
    }

    const balance = await getBalance(wallet.stellarPublicKey)
    res.json({ balance: balance.balance, publicKey: wallet.stellarPublicKey })
  } catch (err) {
    next(err)
  }
}

export const getWalletTransactions = async (req, res, next) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user.id },
    })
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' })
    }

    const txs = await getAccountTransactions(wallet.stellarPublicKey, 10)
    res.json({ transactions: txs })
  } catch (err) {
    next(err)
  }
}

export const sendWalletUSDC = async (req, res, next) => {
  try {
    const { to, amount } = req.body
    if (!to || !amount) {
      return res.status(400).json({ error: 'Missing destination or amount' })
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user.id },
    })
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' })
    }

    const secret = decryptText(wallet.encryptedSecretKey)
    const tx = await sendUSDC({
      sourceSecret: secret,
      destinationPublic: to,
      amount,
    })

    await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type: 'send_usdc',
        amount: Number(amount),
        status: 'completed',
        txHash: tx.hash,
      },
    })

    res.json({ txHash: tx.hash })
  } catch (err) {
    next(err)
  }
}
