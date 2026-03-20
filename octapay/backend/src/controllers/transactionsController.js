import prisma from '../prisma/client.js'

export const listTransactions = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(5, Number(req.query.limit) || 20))
    const skip = (page - 1) * limit

    const [count, transactions] = await Promise.all([
      prisma.transaction.count({ where: { userId: req.user.id } }),
      prisma.transaction.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ])

    res.json({
      transactions,
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit),
    })
  } catch (err) {
    next(err)
  }
}
