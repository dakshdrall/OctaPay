import prisma from '../prisma/client.js'

export const listTransactions = async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ transactions })
  } catch (err) {
    next(err)
  }
}
