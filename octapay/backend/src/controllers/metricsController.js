import prisma from '../prisma/client.js'

export const getMetrics = async (req, res, next) => {
  try {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const last7Days = new Date(now - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now - 30 * 24 * 60 * 60 * 1000)

    // Total users
    const totalUsers = await prisma.user.count()

    // DAU - users who made a transaction today
    const dau = await prisma.transaction.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: startOfToday } },
    })

    // Total transactions
    const totalTransactions = await prisma.transaction.count()

    // Transactions last 7 days
    const weeklyTransactions = await prisma.transaction.count({
      where: { createdAt: { gte: last7Days } },
    })

    // Total volume (XLM + USDC combined)
    const volumeData = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { status: 'completed' },
    })

    // Transaction breakdown by type
    const txByType = await prisma.transaction.groupBy({
      by: ['type'],
      _count: { type: true },
    })

    // Daily transactions last 7 days (for chart)
    const dailyTx = await prisma.transaction.groupBy({
      by: ['createdAt'],
      _count: { id: true },
      where: { createdAt: { gte: last7Days } },
      orderBy: { createdAt: 'asc' },
    })

    // Active users last 30 days (retention)
    const monthlyActiveUsers = await prisma.transaction.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: last30Days } },
    })

    res.json({
      totalUsers,
      dau: dau.length,
      mau: monthlyActiveUsers.length,
      totalTransactions,
      weeklyTransactions,
      totalVolume: volumeData._sum.amount || 0,
      txByType,
      sponsorWallet: process.env.SPONSOR_PUBLIC_KEY || 'GCGKABB3RN7NRX4CVM6EFDBXH4FSD33NKBCWF45VR2B2QNVWCILQMRIQ',
    })
  } catch (err) {
    next(err)
  }
}
