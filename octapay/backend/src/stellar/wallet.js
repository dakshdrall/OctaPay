import StellarSdk from 'stellar-sdk';
const { Keypair, Networks, Asset, Operation, TransactionBuilder, Memo } = StellarSdk;

const STELLAR_NETWORK = process.env.STELLAR_NETWORK || 'testnet';
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export const createWallet = () => {
  const keypair = Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret()
  };
};

export const fundWallet = async (publicKey) => {
  const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
  return response.json();
};

export const getBalance = async (publicKey) => {
  try {
    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find(b => b.asset_type === 'native');
    return { xlm: xlmBalance ? xlmBalance.balance : '0', balances: account.balances };
  } catch (e) {
    return { xlm: '0', balances: [] };
  }
};

export const sendPayment = async (fromSecret, toPublic, amount, asset = 'XLM') => {
  const fromKeypair = Keypair.fromSecret(fromSecret);
  const account = await server.loadAccount(fromKeypair.publicKey());
  const transaction = new TransactionBuilder(account, {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET
  })
    .addOperation(Operation.payment({
      destination: toPublic,
      asset: StellarSdk.Asset.native(),
      amount: String(amount)
    }))
    .setTimeout(30)
    .build();
  transaction.sign(fromKeypair);
  return server.submitTransaction(transaction);
};
