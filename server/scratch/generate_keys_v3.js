const crypto = require('crypto');

function base64url(buf) {
    return buf.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

const ecdh = crypto.createECDH('prime256v1');
ecdh.generateKeys();

console.log('VAPID_PUBLIC_KEY=' + base64url(ecdh.getPublicKey()));
console.log('VAPID_PRIVATE_KEY=' + base64url(ecdh.getPrivateKey()));
