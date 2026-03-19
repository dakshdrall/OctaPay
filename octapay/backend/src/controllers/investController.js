import prisma from '../prisma/client.js'

export const listInvestments = async (req, res, next) => {
  try {
    const investments = await prisma.investment.findMany({
      where: { userId: req.user.id },
      orderBy: { startDate: 'desc' },
    })
    res.json({ investments })
  } catch (err) {
    next(err)
  }
}

export const createInvestment = async (req, res, next) => {
  try {
    const { product, amount, apy } = req.body
    const amt = Number(amount)
    if (!product || !apy || !amt || amt <= 0) {
      return res.status(400).json({ error: 'Invalid investment details' })
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId: req.user.id } })
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet not found' })
    }

    if (wallet.balance < amt) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amt } },
    })

    const investment = await prisma.investment.create({
      data: {
        userId: req.user.id,
        product,
        amount: amt,
        apy: Number(apy),
      },
    })

    await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type: 'investment',
        amount: amt,
        status: 'completed',
      },
    })

    res.status(201).json({ investment, wallet: updatedWallet })
  } catch (err) {
    next(err)
  }
}

export const withdrawInvestment = async (req, res, next) => {
  try {
    const { investmentId } = req.body
    if (!investmentId) {
      return res.status(400).json({ error: 'Missing investmentId' })
    }

    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
    })
    if (!investment || investment.userId !== req.user.id) {
      return res.status(404).json({ error: 'Investment not found' })
    }

    if (investment.status !== 'active') {
      return res.status(400).json({ error: 'Investment already withdrawn' })
    }

    // Simple earnings calculation: prorate APY by days held, capped at 1 year.
    const daysHeld = Math.max(
      1,
      Math.floor((Date.now() - new Date(investment.startDate).getTime()) / (1000 * 60 * 60 * 24))
    )
    const yearFactor = Math.min(daysHeld / 365, 1)
    const earnings = (investment.amount * (investment.apy / 100)) * yearFactor
    const payout = investment.amount + earnings

    const wallet = await prisma.wallet.update({
      where: { userId: req.user.id },
      data: { balance: { increment: payout } },
    })

    const updatedInvestment = await prisma.investment.update({
      where: { id: investmentId },
      data: { status: 'withdrawn' },
    })

    await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type: 'investment_withdraw',
        amount: payout,
        status: 'completed',
      },
    })

    res.json({ investment: updatedInvestment, wallet })
  } catch (err) {
    next(err)
  }
}
