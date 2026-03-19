import { Asset, Keypair, Networks, Operation, Server, TransactionBuilder } from 'stellar-sdk'

const server = new Server('https://horizon-testnet.stellar.org')

const getUsdcAsset = () => {
  const issuer = process.env.STELLAR_USDC_ISSUER
  if (!issuer) {
    throw new Error('Missing STELLAR_USDC_ISSUER environment variable')
  }
  return new Asset('USDC', issuer)
}

export const sendUSDC = async ({ sourceSecret, destinationPublic, amount }) => {
  const sourceKeypair = Keypair.fromSecret(sourceSecret)
  const account = await server.loadAccount(sourceKeypair.publicKey())
  const asset = getUsdcAsset()

  const tx = new TransactionBuilder(account, {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: destinationPublic,
        asset,
        amount: amount.toString(),
      })
    )
    .setTimeout(30)
    .build()

  tx.sign(sourceKeypair)
  return server.submitTransaction(tx)
}

export const getAccountTransactions = async (publicKey, limit = 10) => {
  const accountTx = await server
    .transactions()
    .forAccount(publicKey)
    .limit(limit)
    .order('desc')
    .call()

  return accountTx.records
}
