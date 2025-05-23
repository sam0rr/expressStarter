const crypto = require('crypto');
const argon2 = require('argon2');
const sodium = require('sodium-native');

class Cryptography {
    static OPSLIMIT = sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE;
    static MEMLIMIT = sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE;
    static ALG = sodium.crypto_pwhash_ALG_ARGON2ID13;
    static KEY_LENGTH = sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES;
    static NONCE_LENGTH = sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES;

    /**
     * Secure password hashing (Argon2id)
     */
    static async hashPassword(password) {
        return await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1
        });
    }

    /**
     * Verify Argon2id password hash
     */
    static async verifyPassword(plainText, hashed) {
        try {
            return await argon2.verify(hashed, plainText);
        } catch {
            return false;
        }
    }

    /**
     * SHA-256 hash, hex encoded
     */
    static hashSHA256(input) {
        return crypto.createHash('sha256').update(input).digest('hex');
    }

    /**
     * Generate cryptographically secure random salt (hex)
     */
    static generateSalt(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Encrypts plaintext with a key using XChaCha20-Poly1305 (returns nonce + cipher)
     */
    static encryptRaw(plaintext, key) {
        if (!Buffer.isBuffer(key) || key.length !== Cryptography.KEY_LENGTH) {
            throw new Error('Invalid key length');
        }

        const nonce = crypto.randomBytes(Cryptography.NONCE_LENGTH);
        const message = Buffer.from(plaintext, 'utf8');
        const cipher = Buffer.alloc(message.length + sodium.crypto_aead_xchacha20poly1305_ietf_ABYTES);

        sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(cipher, message, null, null, nonce, key);
        Cryptography.zeroMemory(key);

        return Buffer.concat([nonce, cipher]);
    }

    /**
     * Base64-encoded encryption output
     */
    static encrypt(plaintext, key) {
        return Cryptography.encryptRaw(plaintext, key).toString('base64');
    }

    /**
     * Decrypt raw (nonce + cipher)
     */
    static decryptRaw(buffer, key) {
        if (!Buffer.isBuffer(key) || key.length !== Cryptography.KEY_LENGTH) {
            throw new Error('Invalid key length');
        }

        if (buffer.length < Cryptography.NONCE_LENGTH) {
            throw new Error('Invalid AEAD payload');
        }

        const nonce = buffer.subarray(0, Cryptography.NONCE_LENGTH);
        const cipher = buffer.subarray(Cryptography.NONCE_LENGTH);
        const message = Buffer.alloc(cipher.length - sodium.crypto_aead_xchacha20poly1305_ietf_ABYTES);

        const ok = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(message, null, cipher, null, nonce, key);
        if (!ok) throw new Error('Decryption failed or corrupted');

        Cryptography.zeroMemory(key);
        return message.toString('utf8');
    }

    /**
     * Decrypt from base64 input
     */
    static decrypt(encodedBase64, key) {
        const raw = Buffer.from(encodedBase64, 'base64');
        return Cryptography.decryptRaw(raw, key);
    }

    /**
     * Securely wipes a buffer
     */
    static zeroMemory(buffer) {
        if (Buffer.isBuffer(buffer)) buffer.fill(0);
    }
}

module.exports = Cryptography;
