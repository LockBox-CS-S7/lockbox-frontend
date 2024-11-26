// const crypto = require('crypto');


// /**
//  * Encrypts the given plaintext using AES-GCM with a 256 bits key.
//  * @param {string} plaintext - The plain text data that should be encrypted.
//  * @param {string} passphrase - The passphrase to encrypt the data with.
//  * @returns {string} The encrypted data.
//  */
// function encryptAES(plaintext, passphrase) {
//     const salt = crypto.randomBytes(16);
//     const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256')
//     const iv = crypto.randomBytes(12);
//     const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

//     let encrypted = cipher.update(plaintext, 'utf-8', 'hex');
//     encrypted += cipher.final('hex');

//     const tag = cipher.getAuthTag();
    
//     const output = Buffer.concat([
//         salt,
//         iv,
//         Buffer.from(encrypted, 'hex'),
//         tag
//     ]).toString('base64');
    
//     return output;
// }


// /**
//  * Decrypts the given encrypted data using AES-GCM with a 256-bit key derived from a passphrase.
//  * @param {string} encryptedData - The encrypted data in Base64 format.
//  * @param {string} passphrase - The passphrase used to derive the decryption key.
//  * @returns {string} The decrypted plaintext.
//  */
// function decryptAES(encryptedData, passphrase) {
//     const dataBuffer = Buffer.from(encryptedData, 'base64');

//     // Extract the salt, IV, encrypted data, and authentication tag
//     const salt = dataBuffer.subarray(0, 16);            // First 16 bytes for the salt
//     const iv = dataBuffer.subarray(16, 28);             // Next 12 bytes for the IV
//     const encryptedText = dataBuffer.subarray(28, -16); // All data before the last 16 bytes is the encrypted text
//     const tag = dataBuffer.subarray(-16);               // Last 16 bytes for the authentication tag
//     const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256'); // 32 bytes for AES-256

//     const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
//     decipher.setAuthTag(tag);

//     let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
//     decrypted += decipher.final('utf-8');

//     return decrypted;
// }


// export { encryptAES, decryptAES };
