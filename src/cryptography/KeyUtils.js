const crypto = require('crypto');
const sodium = require('sodium-native');
const Cryptography = require('./Cryptography');

class KeyUtils {
    static SEED_BYTES = sodium.crypto_box_SEEDBYTES;
    static KEY_LENGTH = sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES;

    static keypairCache = new Map();

    /**
     * Derives a strong symmetric key from a password and a hex-encoded salt using Argon2id.
     * Returns a raw binary Buffer of KEY_LENGTH bytes.
     */
    static deriveCryptoKey(password, hexSalt, length = Cryptography.KEY_LENGTH) {
        const salt = Buffer.from(hexSalt, 'hex');
        if (salt.length !== sodium.crypto_pwhash_SALTBYTES) {
            throw new Error(`Salt must be ${sodium.crypto_pwhash_SALTBYTES * 2} hex characters`);
        }

        const key = Buffer.alloc(length);
        sodium.crypto_pwhash(
            key,
            Buffer.from(password),
            salt,
            Cryptography.OPSLIMIT,
            Cryptography.MEMLIMIT,
            Cryptography.ALG
        );

        Cryptography.zeroMemory(salt);
        return key;
    }

    /**
     * Ensures the userKey is a normalized 64-character hex string.
     */
    static normalizeUserKey(userKey) {
        if (!/^[a-f0-9]{64}$/i.test(userKey)) {
            const raw = Buffer.from(userKey, 'utf8');
            return raw.toString('hex');
        }
        return userKey;
    }

    /**
     * Returns a cached X25519 keypair derived from a userKey.
     * Keypair = 64 bytes: public (0-31), private (32-63)
     */
    static getKeypairFromUserKey(userKey) {
        const normalized = this.normalizeUserKey(userKey);

        if (!/^[a-f0-9]{64}$/.test(normalized)) {
            throw new Error('User key must be a 32-byte hex string');
        }

        const cacheKey = normalized;
        if (!this.keypairCache.has(cacheKey)) {
            const seed = Buffer.from(normalized, 'hex');
            const kp = Buffer.alloc(sodium.crypto_box_KEYPAIRBYTES);
            sodium.crypto_box_seed_keypair(kp.subarray(0, 32), kp.subarray(32), seed);
            Cryptography.zeroMemory(seed);
            this.keypairCache.set(cacheKey, kp);
        }

        return this.keypairCache.get(cacheKey);
    }

    /**
     * Generates a Base64-encoded public key from a userKey.
     */
    static generatePublicKeyFromUserKey(userKey) {
        const keypair = this.getKeypairFromUserKey(userKey);
        const pubKey = keypair.subarray(0, 32);
        return Buffer.from(pubKey).toString('base64');
    }

    /**
     * Encrypts plaintext to a recipient's public key using sealed boxes (anonymous encryption).
     */
    static sealWithPublicKey(plaintext, base64PublicKey) {
        const pub = Buffer.from(base64PublicKey, 'base64');
        const sealed = Buffer.alloc(sodium.crypto_box_SEALBYTES + Buffer.byteLength(plaintext));
        sodium.crypto_box_seal(sealed, Buffer.from(plaintext), pub);
        return sealed.toString('base64');
    }

    /**
     * Decrypts a sealed box using the recipient's private key derived from userKey.
     */
    static openSealedData(sealedBase64, userKey) {
        const sealed = Buffer.from(sealedBase64, 'base64');
        const keypair = this.getKeypairFromUserKey(userKey);
        const pub = keypair.subarray(0, 32);
        const priv = keypair.subarray(32);

        const msg = Buffer.alloc(sealed.length - sodium.crypto_box_SEALBYTES);
        const success = sodium.crypto_box_seal_open(msg, sealed, pub, priv);
        if (!success) throw new Error('Failed to open sealed box');
        return msg.toString('utf8');
    }

    /**
     * Encrypts plaintext into a JSON envelope containing encrypted data and a sealed DEK.
     */
    static encryptEnvelope(plaintext, userKey) {
        const dek = crypto.randomBytes(this.KEY_LENGTH);
        const cipher = Cryptography.encrypt(plaintext, dek);

        const keypair = this.getKeypairFromUserKey(userKey);
        const pub = keypair.subarray(0, 32);
        const sealedDEK = Buffer.alloc(sodium.crypto_box_SEALBYTES + dek.length);
        sodium.crypto_box_seal(sealedDEK, dek, pub);

        Cryptography.zeroMemory(dek);

        return JSON.stringify({
            d: cipher,
            k: sealedDEK.toString('base64')
        });
    }

    /**
     * Decrypts a JSON envelope using userKey (unwraps DEK and decrypts payload).
     */
    static decryptEnvelope(envelopeJson, userKey) {
        const env = JSON.parse(envelopeJson);
        if (!env.d || !env.k) throw new Error('Envelope must contain "d" and "k"');

        const sealed = Buffer.from(env.k, 'base64');
        const keypair = this.getKeypairFromUserKey(userKey);
        const pub = keypair.subarray(0, 32);
        const priv = keypair.subarray(32);
        const dek = Buffer.alloc(sealed.length - sodium.crypto_box_SEALBYTES);

        const success = sodium.crypto_box_seal_open(dek, sealed, pub, priv);
        if (!success) throw new Error('Failed to decrypt envelope DEK');

        try {
            return Cryptography.decrypt(env.d, dek);
        } finally {
            Cryptography.zeroMemory(dek);
        }
    }

    /**
     * Reseals the envelope DEK to a new userKey.
     */
    static rewrapEnvelope(envelopeJson, oldKey, newKey) {
        const env = JSON.parse(envelopeJson);
        const oldKp = this.getKeypairFromUserKey(oldKey);
        const newKp = this.getKeypairFromUserKey(newKey);

        const oldPub = oldKp.subarray(0, 32);
        const oldPriv = oldKp.subarray(32);
        const sealed = Buffer.from(env.k, 'base64');
        const dek = Buffer.alloc(sealed.length - sodium.crypto_box_SEALBYTES);

        const ok = sodium.crypto_box_seal_open(dek, sealed, oldPub, oldPriv);
        if (!ok) throw new Error('Failed to unwrap DEK from old key');

        const newPub = newKp.subarray(0, 32);
        const newSealed = Buffer.alloc(sodium.crypto_box_SEALBYTES + dek.length);
        sodium.crypto_box_seal(newSealed, dek, newPub);

        return JSON.stringify({
            d: env.d,
            k: newSealed.toString('base64')
        });
    }
}

module.exports = KeyUtils;
