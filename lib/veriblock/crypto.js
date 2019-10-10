// VeriBlock Blockchain Project
// Copyright 2017-2018 VeriBlock, Inc
// Copyright 2018-2019 Xenios SEZC
// All rights reserved.
// https://www.veriblock.org
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
const secp256k1 = require('secp256k1')
const vbkhash = require('./hash');
const vbkcrypto = require('./crypto');
const vbkaddress = require('./address');
// prefix which you need to add to an uncompressed public key to get asn1 (java-like) public key
exports.PUBKEY_ASN1_PREFIX = Buffer.from('3056301006072A8648CE3D020106052B8104000A034200', 'hex');
// prefix which you need to add to a private key to get asn1 (java-like) private key
exports.PRIVKEY_ASN1_PREFIX = Buffer.from('303E020100301006072A8648CE3D020106052B8104000A042730250201010420', 'hex');
class PublicKey {
    constructor(buffer) {
        if (buffer.length === 88 &&
            buffer[23] === 0x04 &&
            buffer.slice(0, exports.PUBKEY_ASN1_PREFIX.length).compare(exports.PUBKEY_ASN1_PREFIX) ===
                0) {
            // it is a full asn1 encoded key
            this._full = buffer;
        }
        else if (buffer.length === 65 && buffer[0] === 0x04) {
            // it is an uncompressed secp256k1 public key in format [0x04 + x + y]
            this._full = Buffer.concat([exports.PUBKEY_ASN1_PREFIX, buffer]);
        }
        else if (buffer.length === 33) {
            // 0x02 = even root
            // 0x03 = odd root
            if (buffer[0] !== 0x02 && buffer[0] !== 0x03) {
                throw new Error('invalid key format, expected 0x02 or 0x03 as first byte');
            }
            // it is a compressed secp256k1 public key in format [0x0(2|3) + x]
            const uncompressed = secp256k1.publicKeyConvert(buffer, false);
            this._full = Buffer.concat([exports.PUBKEY_ASN1_PREFIX, uncompressed]);
        }
        else {
            throw new Error('unknown public key format');
        }
    }
    get compressed() {
        // extract [0x02 + x] from [exports.PUBKEY_ASN1_PREFIX + 0x04 + x + y]
        return Buffer.concat([
            Buffer.from([0x02]),
            this._full.slice(this._full.length - 64, this._full.length - 32),
        ]);
    }
    get uncompressed() {
        // return last 65 bytes
        return this._full.slice(this._full.length - 65);
    }
    get asn1() {
        return this._full;
    }
    getAddress() {
        return vbkaddress.addressFromPublicKey(this);
    }
    toStringHex() {
        return this.asn1.toString('hex');
    }
    static fromStringHex(h) {
        return new PublicKey(Buffer.from(h, 'hex'));
    }
}
exports.PublicKey = PublicKey;
class PrivateKey {
    constructor(buffer) {
        if (buffer.length === 32) {
            this._full = Buffer.concat([exports.PRIVKEY_ASN1_PREFIX, buffer]);
        }
        else if (buffer.length === 64 &&
            buffer
                .slice(0, exports.PRIVKEY_ASN1_PREFIX.length)
                .compare(exports.PRIVKEY_ASN1_PREFIX) === 0) {
            this._full = buffer;
        }
        else {
            throw new Error('unknown private key format');
        }
    }
    get canonical() {
        // return last 32 bytes
        return this._full.slice(this._full.length - 32);
    }
    get asn1() {
        return this._full;
    }
    derivePublicKey() {
        const buf = secp256k1.publicKeyCreate(this.canonical, true);
        return new PublicKey(buf);
    }
    toStringHex() {
        return this.asn1.toString('hex');
    }
    static fromStringHex(h) {
        return new PrivateKey(Buffer.from(h, 'hex'));
    }
}
exports.PrivateKey = PrivateKey;
class Signature {
    constructor(buffer) {
        if (buffer.length === 71) {
            this._canonical = secp256k1.signatureImport(buffer);
        }
        else if (buffer.length === 64) {
            this._canonical = buffer;
        }
        else {
            throw new Error('unknown signature format');
        }
    }
    /// returns full asn1 encoded signature of length 71 bytes
    get asn1() {
        return secp256k1.signatureExport(this._canonical);
    }
    /// returns canonical secp256k1 signature with length 64 bytes
    get canonical() {
        return this._canonical;
    }
    toStringHex() {
        return this.asn1.toString('hex');
    }
    static fromStringHex(h) {
        return new Signature(Buffer.from(h, 'hex'));
    }
}
exports.Signature = Signature;
class KeyPair {
    constructor(publicKey, privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
    static fromPrivateKey(privateKey) {
        if (privateKey instanceof Buffer) {
            privateKey = new PrivateKey(privateKey);
        }
        const pub = privateKey.derivePublicKey();
        return new KeyPair(pub, privateKey);
    }
    static generate(entropy) {
        if (!entropy) {
            entropy = vbkcrypto.randomBytes(32);
        }
        if (entropy.length < 32) {
            throw new Error('not enough entropy, supply 32 bytes or more');
        }
        const priv = new PrivateKey(vbkhash.sha256(entropy));
        const pub = priv.derivePublicKey();
        return new KeyPair(pub, priv);
    }
}
exports.KeyPair = KeyPair;
class SHA256withECDSA {
    static sign(msg, privateKey) {
        if (privateKey instanceof KeyPair) {
            privateKey = privateKey.privateKey;
        }
        const m = vbkhash.sha256(msg);
        const sig = secp256k1.sign(m, privateKey.canonical);
        return new Signature(sig.signature);
    }
    static verify(msg, sig, publicKey) {
        if (publicKey instanceof KeyPair) {
            publicKey = publicKey.publicKey;
        }
        const m = vbkhash.sha256(msg);
        return secp256k1.verify(m, sig.canonical, publicKey.uncompressed);
    }
}
exports.SHA256withECDSA = SHA256withECDSA;