export const getLoans = async (req, res) => {
  // TODO: fetch loans for authenticated user
  res.json({ loans: [] })
}

export const createLoan = async (req, res) => {
  // TODO: create a loan via Soroban smart contract call
  res.status(201).json({ loan: null })
}
