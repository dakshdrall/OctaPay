import fetch from 'node-fetch'

export const fundTestnetAccount = async (publicKey) => {
  const url = `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Friendbot failed: ${res.statusText}`)
  }
  return res.json()
}
