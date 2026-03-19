import { Asset, Keypair, Memo, Networks, Operation, Server, TransactionBuilder } from 'stellar-sdk'
import { fundTestnetAccount } from './friendbot.js'

const server = new Server('https://horizon-testnet.stellar.org')

const getUsdcAsset = () => {
  const issuer = process.env.STELLAR_USDC_ISSUER
  if (!issuer) {
    throw new Error('Missing STELLAR_USDC_ISSUER environment variable')
  }
  return new Asset('USDC', issuer)
}

export const createStellarWallet = async ({ initialUsdc = 0 } = {}) => {
  const keypair = Keypair.random()
  const publicKey = keypair.publicKey()
  const secret = keypair.secret()

  // Fund account with XLM so it can create trustlines and pay fees.
  await fundTestnetAccount(publicKey)

  // Ensure the account trusts USDC asset
  const asset = getUsdcAsset()
  const account = await server.loadAccount(publicKey)

  const trustTx = new TransactionBuilder(account, {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.changeTrust({
        asset,
        limit: '1000000000',
      })
    )
    .setTimeout(30)
    .build()

  trustTx.sign(keypair)
  await server.submitTransaction(trustTx)

  // If an initial USDC amount is requested, attempt to send from distribution account.
  if (initialUsdc > 0 && process.env.STELLAR_USDC_DISTRIBUTION_SECRET) {
    const distributionSecret = process.env.STELLAR_USDC_DISTRIBUTION_SECRET
    const distributionKeypair = Keypair.fromSecret(distributionSecret)
    const distributionAccount = await server.loadAccount(distributionKeypair.publicKey())

    const paymentTx = new TransactionBuilder(distributionAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: publicKey,
          asset,
          amount: initialUsdc.toString(),
        })
      )
      .setTimeout(30)
      .build()

    paymentTx.sign(distributionKeypair)
    await server.submitTransaction(paymentTx)
  }

  return { publicKey, secret }
}

export const getBalance = async (publicKey) => {
  const account = await server.loadAccount(publicKey)
  const asset = getUsdcAsset()

  const balanceEntry = account.balances.find((b) => {
    return b.asset_code === 'USDC' && b.asset_issuer === asset.issuer
  })

  return {
    balance: balanceEntry ? Number(balanceEntry.balance) : 0,
    balances: account.balances,
  }
}

export const sendUSDC = async ({ sourceSecret, destinationPublic, amount }) => {
  const sourceKeypair = Keypair.fromSecret(sourceSecret)
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey())
  const asset = getUsdcAsset()

  const tx = new TransactionBuilder(sourceAccount, {
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
