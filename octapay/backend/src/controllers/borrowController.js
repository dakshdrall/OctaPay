import prisma from '../prisma/client.js'
import { getBalance } from '../stellar/wallet.js'

export const getLoans = async (req, res, next) => {
  try {
    const loans = await prisma.loan.findMany({
      where: { userId: req.user.id },
      orderBy: { dueDate: 'asc' },
    })
    res.json({ loans })
  } catch (err) {
    next(err)
  }
}

export const createLoan = async (req, res, next) => {
  try {
    const { collateral } = req.body
    const collateralAmount = Number(collateral)

    if (!collateralAmount || collateralAmount <= 0) {
      return res.status(400).json({ error: 'Invalid collateral amount' })
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId: req.user.id } })
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet not found' })
    }

    const onChain = await getBalance(wallet.stellarPublicKey)
    const onChainBalance = onChain.balance ?? 0
    if (onChainBalance < collateralAmount) {
      return res.status(400).json({ error: 'Insufficient balance for collateral' })
    }

    const maxBorrow = Math.floor(collateralAmount * 0.6 * 100) / 100

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: collateralAmount } },
    })

    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    const loan = await prisma.loan.create({
      data: {
        userId: req.user.id,
        collateral: collateralAmount,
        borrowed: maxBorrow,
        repaid: 0,
        status: 'active',
        contractAddress: '',
        dueDate,
      },
    })

    await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type: 'loan_disbursement',
        amount: maxBorrow,
        status: 'completed',
      },
    })

    res.status(201).json({ loan, wallet: updatedWallet })
  } catch (err) {
    next(err)
  }
}

export const repayLoan = async (req, res, next) => {
  try {
    const { loanId, amount } = req.body
    const repayAmount = Number(amount)

    if (!loanId || !repayAmount || repayAmount <= 0) {
      return res.status(400).json({ error: 'Invalid repayment' })
    }

    const loan = await prisma.loan.findUnique({ where: { id: loanId } })
    if (!loan || loan.userId !== req.user.id) {
      return res.status(404).json({ error: 'Loan not found' })
    }

    const outstanding = Math.max(loan.borrowed - loan.repaid, 0)
    if (outstanding <= 0) {
      return res.status(400).json({ error: 'Loan already repaid' })
    }

    const repay = Math.min(repayAmount, outstanding)

    const wallet = await prisma.wallet.findUnique({ where: { userId: req.user.id } })
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet not found' })
    }

    const onChain = await getBalance(wallet.stellarPublicKey)
    const onChainBalance = onChain.balance ?? 0
    if (onChainBalance < repay) {
      return res.status(400).json({ error: 'Insufficient balance to repay' })
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: repay } },
    })

    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: {
        repaid: { increment: repay },
        status: repay + loan.repaid >= loan.borrowed ? 'closed' : 'active',
      },
    })

    await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type: 'loan_repayment',
        amount: repay,
        status: 'completed',
      },
    })

    res.json({ loan: updatedLoan, wallet: updatedWallet })
  } catch (err) {
    next(err)
  }
}
