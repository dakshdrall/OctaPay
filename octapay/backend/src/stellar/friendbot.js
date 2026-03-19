import fetch from 'node-fetch'

export const fundTestnetAccount = async (publicKey) => {
  const url = `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Friendbot failed: ${res.status} ${res.statusText} - ${body}`)
  }
  return res.json()
}

export const fundWallet = async (publicKey) => {
  const funding = await fundTestnetAccount(publicKey)
  if (!funding?.hash) {
    throw new Error('Friendbot funding did not return a transaction hash')
  }
  return funding
}
