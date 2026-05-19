import crypto from 'crypto'

const algorithm = 'aes-256-gcm'
const version = 'v1'

function getEncryptionKey() {
  const secret = process.env.SIGNUP_ENCRYPTION_KEY || process.env.PAYLOAD_SECRET

  if (!secret) {
    throw new Error('SIGNUP_ENCRYPTION_KEY or PAYLOAD_SECRET must be configured')
  }

  return crypto.createHash('sha256').update(secret).digest()
}

export function encryptSignupPassword(password: string) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(algorithm, getEncryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [
    version,
    iv.toString('base64url'),
    authTag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join(':')
}

export function decryptSignupPassword(value: string) {
  const [storedVersion, iv, authTag, encrypted] = value.split(':')

  if (storedVersion !== version || !iv || !authTag || !encrypted) {
    throw new Error('Invalid encrypted signup password')
  }

  const decipher = crypto.createDecipheriv(
    algorithm,
    getEncryptionKey(),
    Buffer.from(iv, 'base64url'),
  )
  decipher.setAuthTag(Buffer.from(authTag, 'base64url'))

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'base64url')),
    decipher.final(),
  ]).toString('utf8')
}
