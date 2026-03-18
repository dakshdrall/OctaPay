export const listInvestments = async (req, res) => {
  // TODO: fetch investments for authenticated user
  res.json({ investments: [] })
}

export const createInvestment = async (req, res) => {
  // TODO: allocate user funds into a mock investment product
  res.status(201).json({ investment: null })
}
