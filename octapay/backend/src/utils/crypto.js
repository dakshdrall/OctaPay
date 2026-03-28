import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const TAG_LENGTH = 16

function getKey() {
  const keyBase64 = process.env.WALLET_ENCRYPTION_KEY || "AsD99WyZDk9eWZazr1K1YclyurkGCYpVunVrJNHquWc="
  if (!keyBase64) {
    throw new Error('Missing WALLET_ENCRYPTION_KEY environment variable')
  }
  const key = Buffer.from(keyBase64, 'base64')
  if (key.length !== 32) {
    throw new Error('WALLET_ENCRYPTION_KEY must be a 32-byte base64 string')
  }
  return key
}

export function encryptText(plaintext) {
  const key = getKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH })
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`
}

export function decryptText(ciphertext) {
  const key = getKey()
  const [ivB64, tagB64, dataB64] = ciphertext.split('.')
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error('Invalid ciphertext format')
  }
  const iv = Buffer.from(ivB64, 'base64')
  const tag = Buffer.from(tagB64, 'base64')
  const encrypted = Buffer.from(dataB64, 'base64')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH })
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString('utf8')
}
