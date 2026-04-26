import pkg from 'stellar-sdk';
const { Horizon, Networks, Asset, TransactionBuilder, Operation, Keypair } = pkg;

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

const getSponsorKeypair = () => {
  const secret = process.env.SPONSOR_SECRET_KEY;
  if (!secret) throw new Error('Missing SPONSOR_SECRET_KEY in environment');
  return Keypair.fromSecret(secret);
};

const getUsdcAsset = () => {
  const issuer = process.env.STELLAR_USDC_ISSUER;
  if (!issuer) throw new Error('Missing STELLAR_USDC_ISSUER environment variable');
  return new Asset('USDC', issuer);
};

const wrapWithFeeBump = async (innerTx) => {
  const sponsorKeypair = getSponsorKeypair();
  const feeBump = TransactionBuilder.buildFeeBumpTransaction(
    sponsorKeypair,
    '200',
    innerTx,
    Networks.TESTNET
  );
  feeBump.sign(sponsorKeypair);
  return server.submitTransaction(feeBump);
};

export const sendXLM = async ({ sourceSecret, destinationPublic, amount }) => {
  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const account = await server.loadAccount(sourceKeypair.publicKey());

  const innerTx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: destinationPublic,
        asset: Asset.native(),
        amount: amount.toString(),
      })
    )
    .setTimeout(30)
    .build();

  innerTx.sign(sourceKeypair);
  return wrapWithFeeBump(innerTx);
};

export const sendUSDC = async ({ sourceSecret, destinationPublic, amount }) => {
  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const account = await server.loadAccount(sourceKeypair.publicKey());
  const asset = getUsdcAsset();

  const innerTx = new TransactionBuilder(account, {
    fee: '100',
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
    .build();

  innerTx.sign(sourceKeypair);
  return wrapWithFeeBump(innerTx);
};

export const getAccountTransactions = async (publicKey, limit = 10) => {
  const txs = await server.transactions()
    .forAccount(publicKey)
    .limit(limit)
    .order('desc')
    .call()
  return txs.records
}
