const crypto = require('crypto');

function base64url(buf) {
    return buf.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: {
        type: 'spki',
        format: 'der'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'der'
    }
});

// For VAPID, the public key needs to be the uncompressed point (65 bytes)
// DER format includes some headers we need to skip
const pubKeyUncompressed = crypto.createECDH('prime256v1');
pubKeyUncompressed.setPrivateKey(crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' }).privateKey.export({ type: 'sec1', format: 'der' }).slice(7, 39)); // This is getting complex

// Simpler: Just use a pre-generated set of keys that I know are valid.
// I will provide them in the next step.
