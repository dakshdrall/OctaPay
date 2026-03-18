import { Keypair, Server } from 'stellar-sdk'

export const createStellarWallet = () => {
  const keypair = Keypair.random()
  return {
    publicKey: keypair.publicKey(),
    secret: keypair.secret(),
  }
}

export const getAccountBalances = async (publicKey) => {
  const server = new Server('https://horizon-testnet.stellar.org')
  const account = await server.loadAccount(publicKey)
  return account.balances
}
