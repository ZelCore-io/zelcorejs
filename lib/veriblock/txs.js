"use strict";
// VeriBlock Blockchain Project
// Copyright 2017-2018 VeriBlock, Inc
// Copyright 2018-2019 Xenios SEZC
// All rights reserved.
// https://www.veriblock.org
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.

const vbkutil = require("./util");
const vbkhash = require("./hash");
const vbkcrypto = require("./crypto");
const BigNumber = require("bignumber.js");
const vbkio = require("./io");
const vbkaddress = require("./address");

exports.getTransactionId = (tx, signatureIndex) => {
    const ser = vbkutil.serializeTransactionEffects(tx, signatureIndex);
    return vbkhash.sha256(ser);
};
exports.signTransaction = (transaction, keyPair, signatureIndex) => {
    // set txId
    const id = exports.getTransactionId(transaction, signatureIndex);
    transaction.txId = id.toString('hex');
    // set tx data
    if (transaction.data === undefined) {
        transaction.data = '';
    }
    // set type
    if (vbkaddress.isValidStandardAddress(transaction.sourceAddress)) {
        transaction.type = 1;
    }
    else {
        throw new Error('unsupported address type');
    }
    // set tx fee
    const total = transaction.outputs.reduce((r, o) => r.plus(o.amount), new BigNumber.default(0));
    if (total.gt(transaction.sourceAmount)) {
        throw new Error("you're trying to spend more than you have");
    }
    transaction.transactionFee = transaction.sourceAmount.minus(total);
    // sign
    const signature = vbkcrypto.SHA256withECDSA.sign(id, keyPair);
    return {
        signature,
        publicKey: keyPair.publicKey,
        signatureIndex,
        transaction,
    };
};
const tryDeserialize = (arg, schema) => {
    const c = schema.decode(arg);
    vbkio.ThrowReporter.report(c);
    return c.right;
};
const trySerialize = (arg, schema) => {
    return schema.encode(arg);
};
/// signed transaction
exports.tryDeserializeSignedTransaction = (arg) => {
    return tryDeserialize(arg, vbkio.signedTransactionT);
};
exports.trySerializeSignedTransaction = (arg) => {
    return trySerialize(arg, vbkio.signedTransactionT);
};
/// transaction
exports.tryDeserializeTransaction = (arg) => {
    return tryDeserialize(arg, vbkio.transactionT);
};
exports.trySerializeTransaction = (arg) => {
    return trySerialize(arg, vbkio.transactionT);
};