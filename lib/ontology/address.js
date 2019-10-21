"use strict";
const zcrypto = require('../crypto');
const zopcodes = require('../opcodes');
const bs58 = require('bs58');
const elliptic = require('elliptic');
const ADDR_VERSION = '17';

function publicKeyFromPrivateKey(privateKey) {
  const secp256r1 = new elliptic.ec('p256');
  const keyPair = secp256r1.keyFromPrivate(privateKey, 'hex');
  const pubKey = keyPair.getPublic(true, 'hex');
  return pubKey;
};

function addressFromPublicKey(publicKey) {
  return addresstoBS58(programHash160(publicKey))
}

function programHash160(publicKey) {
  if (publicKey.length !== 66) {
    throw new Error("publicKey not supported");
  }
  const prefix = (publicKey.length / 2).toString(16);
  const program = prefix + publicKey + zopcodes.OP_CHECKSIG;
  const address = zcrypto.hash160(Buffer.from(program, 'hex'));
  return address;
};

function addresstoBS58(hex) {
  const data = ADDR_VERSION + hex;

  const msg = zcrypto.sha256x2(Buffer.from(data, 'hex'));
  const checksum = msg.slice(0, 8);

  const datas = data + checksum;

  return bs58.encode(Buffer.from(datas, 'hex'));
}

module.exports = {
  publicKeyFromPrivateKey,
  addressFromPublicKey
};