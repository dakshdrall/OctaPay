export const getWallet = async (req, res) => {
  // TODO: fetch wallet details from DB for req.user
  res.json({ wallet: null })
}

export const createWallet = async (req, res) => {
  // TODO: create Stellar testnet wallet and store encrypted private key
  res.status(201).json({ wallet: null })
}
