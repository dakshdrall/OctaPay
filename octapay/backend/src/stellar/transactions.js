import { Server, TransactionBuilder, Networks, Operation, Asset, Keypair } from 'stellar-sdk'

const server = new Server('https://horizon-testnet.stellar.org')

export const sendUSDC = async ({ sourceSecret, destinationPublic, amount }) => {
  const sourceKeypair = Keypair.fromSecret(sourceSecret)
  const account = await server.loadAccount(sourceKeypair.publicKey())

  const asset = new Asset('USDC', 'GBBD47IF6...') // TODO: replace with testnet USDC issuer

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
