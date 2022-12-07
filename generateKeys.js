const crypto = require('crypto');
const fs = require('fs');

function generateKeyPair() {
    const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });

    fs.writeFileSync(__dirname + '/server/keys/id_rsa_pub.pem', publicKey);
    fs.writeFileSync(__dirname + '/server/keys/id_rsa_priv.pem', privateKey);
}

generateKeyPair();