var secp256k1 = require('secp256k1');
var bs58check = require('bs58check');
var zcrypto = require('./crypto');
var btcmessage = require('bitcoinjs-message');
const zeltrezaddress = require('./address');

function doubleHash(msg) {
  const bufMessage = Buffer.from(msg, 'hex')
  message = zcrypto.sha256x2(bufMessage).toString('hex');
  return message;
}

const varintBufNum = function (n) {
  var buf = undefined;
  if (n < 253) {
    buf = Buffer.alloc(1);
    buf.writeUInt8(n, 0);
  } else if (n < 0x10000) {
    buf = Buffer.alloc(1 + 2);
    buf.writeUInt8(253, 0);
    buf.writeUInt16LE(n, 1);
  } else if (n < 0x100000000) {
    buf = Buffer.alloc(1 + 4);
    buf.writeUInt8(254, 0);
    buf.writeUInt32LE(n, 1);
  } else {
    buf = Buffer.alloc(1 + 8);
    buf.writeUInt8(255, 0);
    buf.writeInt32LE(n & -1, 1);
    buf.writeUInt32LE(Math.floor(n / 0x100000000), 5);
  }
  return buf;
};

function WIFToPrivKey(wifPk) {
  var og = bs58check.decode(wifPk, 'hex').toString('hex');
  og = og.substr(2, og.length); // remove WIF format ('80')

  // remove the '01' at the end to 'compress it' during WIF conversion
  if (og.length > 64) {
    og = og.substr(0, 64);
  }

  return og;
}

function signMessage(message, privKey) {
  if (privKey.length !== 64) {
    privKey = WIFToPrivKey(privKey);
  }
  const privateKey = Buffer.from(privKey, "hex");
  const strMessageMagic = "\u0018Zelcash Signed Message:\n"
  const mysignature = btcmessage.sign(message, privateKey, true, strMessageMagic);
  return mysignature.toString("base64");
}

function signStartMessage(message, privKey) {
  if (privKey.length !== 64) {
    privKey = WIFToPrivKey(privKey);
  }
  const privateKey = Buffer.from(privKey, "hex");
  const strMessageMagic = "\u0018Zelcash Signed Message:\n"
  const hashofMessage = doubleHash(message);
  const txid = reverseHex(hashofMessage);
  const mysignature = btcmessage.sign(txid, privateKey, true, strMessageMagic);
  return mysignature.toString("hex");
}

function getZelNodePublicKey(zelnodePrivateKey) {
  var og = WIFToPrivKey(zelnodePrivateKey);

  toCompressed = false;

  const pkBuffer = Buffer.from(og, 'hex');
  var publicKey = secp256k1.publicKeyCreate(pkBuffer, toCompressed);
  return publicKey.toString('hex');
}

// well this is not ideal, but unless that address already spent some coins, we do not have other way to get the public key from it
function getCollateralPublicKey(collateralPrivateKey) {
  var og = WIFToPrivKey(collateralPrivateKey);

  toCompressed = true;

  const pkBuffer = Buffer.from(og, 'hex');
  var publicKey = secp256k1.publicKeyCreate(pkBuffer, toCompressed);
  return publicKey.toString('hex');
}

// reverse hex string byte order
function reverseHex(hex) {
  const buf = Buffer.from(hex, 'hex').reverse();
  return buf.toString('hex');
}

// zelnodePrivateKey as WIF formate, collateralPrivateKey as WIF, timestamp in seconds
function startZelNode(collateralOutHash, collateralOutIndex, collateralPrivateKey, zelnodePrivateKey, timestamp) {
  // it is up to wallet to find out collateral Public Key.
  const version = 5;
  const nType = 2;

  var serializedTx = '';

  // Version
  var _buf32 = Buffer.alloc(4);
  _buf32.writeUInt32LE(version);
  serializedTx += _buf32.toString('hex');

  // nType
  var _buf8 = Buffer.alloc(1);
  _buf8.writeUInt8(nType);
  serializedTx += _buf8.toString('hex');

  // collateralOutHash
  serializedTx += reverseHex(collateralOutHash);

  // collateralOutIndex
  var _buf32 = Buffer.alloc(4);
  _buf32.writeUInt32LE(collateralOutIndex, 0);
  serializedTx += _buf32.toString('hex');

  // get collateral public key
  var collateralPublicKey = getCollateralPublicKey(collateralPrivateKey);

  // collateralPublicKeyLength
  var pubKeyLength = varintBufNum(collateralPublicKey.length / 2);
  serializedTx += pubKeyLength.toString('hex');

  // collateralPublicKey
  serializedTx += collateralPublicKey

  // get public key from zelnode private key;
  var zelnodePublicKey = getZelNodePublicKey(zelnodePrivateKey);

  // zelnodePublicKeyLength
  var pubKeyLength = varintBufNum(zelnodePublicKey.length / 2)
  serializedTx += pubKeyLength.toString('hex');

  // zelnodePublicKey
  serializedTx += zelnodePublicKey

  // timestamp
  var _buf32 = Buffer.alloc(4);
  _buf32.writeUInt32LE(timestamp);
  serializedTx += _buf32.toString('hex');

  // Signing it
  const signature = signStartMessage(serializedTx, collateralPrivateKey);

  // signatureLength
  var sigLength = varintBufNum(signature.length / 2);
  serializedTx += sigLength.toString('hex');

  // zelnodePublicKey
  serializedTx += signature

  return serializedTx;
}

function txidStart(rawtx) {
  // signature is 41 hex length in bytes, remove last 41 -> 65 in decimal. Remove last 65+1 byte (byte before states the signature size);
  const adjustedRawTx = rawtx.substr(0, rawtx.length - 132);
  const hash = doubleHash(adjustedRawTx);
  const txid = reverseHex(hash);
  return txid;
}

function txidConfirm(rawtx) {
  // signature is 41 hex length in bytes, remove last 41 -> 65 in decimal. Remove last 65+1 byte (byte before states the signature size); There is also benchmark signature
  const adjustedRawTx = rawtx.substr(0, rawtx.length - 264);
  const hash = doubleHash(adjustedRawTx);
  const txid = reverseHex(hash);
  return txid;
}


module.exports = {
  startZelNode,
  getZelNodePublicKey,
  getCollateralPublicKey,
  signMessage,
  doubleHash,
  signStartMessage,
  txidStart,
  txidConfirm,
};