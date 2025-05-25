const Cryptography = require('../../cryptography/Cryptography');
const KeyUtils = require('../../cryptography/KeyUtils');

class EncryptionService {
    /**
     * Derives a symmetric key from password + salt (hex-encoded)
     * @param {string} password
     * @param {string} saltHex - must be hex of 32 bytes (64 chars)
     * @returns {Buffer}
     */
    deriveUserKey(password, saltHex) {
        return KeyUtils.deriveCryptoKey(password, saltHex);
    }

    /**
     * Envelope encryption using a derived key
     * @param {string} plaintext
     * @param {string} userKey - hex or buffer
     * @returns {string} JSON envelope
     */
    encryptWithUserKey(plaintext, userKey) {
        return KeyUtils.encryptEnvelope(plaintext, userKey);
    }

    /**
     * Decrypt envelope using userKey
     * @param {string} envelopeJson
     * @param {string} userKey
     * @returns {string}
     */
    decryptWithUserKey(envelopeJson, userKey) {
        return KeyUtils.decryptEnvelope(envelopeJson, userKey);
    }

    /**
     * Secure password hashing with Argon2id
     * @param {string} password
     * @returns {Promise<string>}
     */
    async hashPassword(password) {
        return await Cryptography.hashPassword(password);
    }

    /**
     * Verify password against Argon2 hash
     * @param {string} plain
     * @param {string} hashed
     * @returns {Promise<boolean>}
     */
    async verifyPassword(plain, hashed) {
        return await Cryptography.verifyPassword(plain, hashed);
    }

    /**
     * Compute SHA-256 of string (hex output)
     * @param {string} data
     * @returns {string}
     */
    hash256(data) {
        return Cryptography.hashSHA256(data);
    }

    /**
     * RIPEMD-160 hash convenience
     * @returns {string}
     * @param data
     */
    hashRIPEMD160(data) {
        return Cryptography.hashRIPEMD160(data);
    }

    /**
     * Generic hash function (defaults to SHA-256)
     * @param data
     * @param {string} algorithm - any algorithm supported by crypto.createHash (e.g., 'sha256', 'ripemd160')
     * @returns {string} hex-encoded digest
     */
    hash(data, algorithm = 'sha256') {
        return Cryptography.hash(data, algorithm);
    }

    /**
     * Generate a cryptographically secure random salt (hex-encoded)
     * @param {number} length
     * @returns {string}
     */
    generateSalt(length = 32) {
        return Cryptography.generateSalt(length);
    }

    /**
     * Generate a public key from userKey
     * @param {string} userKey
     * @returns {string} base64 public key
     */
    generatePublicKey(userKey) {
        return KeyUtils.generatePublicKeyFromUserKey(userKey);
    }

    /**
     * Encrypt using anonymous sealed box with recipient public key
     * @param {string} plaintext
     * @param {string} base64PublicKey
     * @returns {string} sealed base64 string
     */
    encryptWithPublicKey(plaintext, base64PublicKey) {
        return KeyUtils.sealWithPublicKey(plaintext, base64PublicKey);
    }

    /**
     * Decrypt a sealed box using the user's private key
     * @param {string} sealedBase64
     * @param {string} userKey
     * @returns {string}
     */
    decryptFromPublicKey(sealedBase64, userKey) {
        return KeyUtils.openSealedData(sealedBase64, userKey);
    }

    /**
     * Rewrap a JSON envelope (reseal DEK to a new user key)
     * @param {string} envelopeJson
     * @param {string} oldKey
     * @param {string} newKey
     * @returns {string}
     */
    rewrapEnvelope(envelopeJson, oldKey, newKey) {
        return KeyUtils.rewrapEnvelope(envelopeJson, oldKey, newKey);
    }
}

module.exports = new EncryptionService();
