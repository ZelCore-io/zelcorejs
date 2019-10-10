// VeriBlock Blockchain Project
// Copyright 2017-2018 VeriBlock, Inc
// Copyright 2018-2019 Xenios SEZC
// All rights reserved.
// https://www.veriblock.org
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
// tslint:disable-next-line:variable-name
const BigNumber = require('bignumber.js');
// tslint:disable-next-line:variable-name
const JSONbig = require('json-bigint')({ strict: true, storeAsString: false });
const vbkaddress = require('./address');
const vbkutil = require('./util');
const vbkhash = require('./hash');
const vbkcrypto = require('./crypto');

class Output {
    constructor(address, amount) {
        this.address = address;
        this.amount = amount;
        vbkutil.assertAddressValid(address);
        vbkutil.assertAmountValid(amount);
    }
    toJSON() {
        return {
            address: this.address,
            amount: this.amount,
        };
    }
    stringify() {
        return JSONbig.stringify(this);
    }
    static parse(json) {
        return Output.fromJSON(JSONbig.parse(json));
    }
    // tslint:disable-next-line:no-any
    static fromJSON(obj) {
        const { address, amount } = obj;
        return new Output(address, new BigNumber(amount));
    }
}
exports.Output = Output;
class Transaction {
    constructor(sourceAddress, sourceAmount, outputs, networkByte) {
        this.sourceAddress = sourceAddress;
        this.sourceAmount = sourceAmount;
        this.outputs = outputs;
        this.networkByte = networkByte;
        if (vbkaddress.isValidStandardAddress(sourceAddress)) {
            this.type = 1
        }
        else if (vbkaddress.isValidMultisigAddress(sourceAddress)) {
            this.type = 3
        }
        else {
            throw new Error('invalid source address');
        }
        vbkutil.assertAmountValid(sourceAmount);
        outputs.forEach(o => {
            vbkutil.assertAddressValid(o.address);
            vbkutil.assertAmountValid(o.amount);
        });
        vbkutil.assertByteValid(networkByte);
    }
    stringify() {
        return JSONbig.stringify(this);
    }
    toJSON() {
        return {
            type: this.type,
            sourceAddress: this.sourceAddress,
            sourceAmount: this.sourceAmount,
            outputs: this.outputs,
            networkByte: this.networkByte,
        };
    }
    static parse(json) {
        return Transaction.fromJSON(JSONbig.parse(json));
    }
    // tslint:disable-next-line:no-any
    static fromJSON(obj) {
        const { sourceAddress, sourceAmount, outputs, networkByte } = obj;
        return new Transaction(sourceAddress, sourceAmount, 
        // tslint:disable-next-line:no-any
        outputs.map((o) => Output.fromJSON(o)), networkByte);
    }
}
exports.Transaction = Transaction;
exports.getTransactionId = (tx, signatureIndex) => {
    const ser = vbkutil.serializeTransactionEffects(tx, signatureIndex);
    return vbkhash.sha256(ser);
};
class SignedTransaction {
    constructor(signature, publicKey, signatureIndex, transaction) {
        this.signature = signature;
        this.publicKey = publicKey;
        this.signatureIndex = signatureIndex;
        this.transaction = transaction;
        vbkutil.assertByteValid(signatureIndex);
    }
    stringify() {
        return JSONbig.stringify(this);
    }
    toJSON() {
        return {
            signature: this.signature.toStringHex(),
            publicKey: this.publicKey.toStringHex(),
            signatureIndex: this.signatureIndex,
            transaction: this.transaction,
        };
    }
    static parse(json) {
        return SignedTransaction.fromJSON(JSONbig.parse(json));
    }
    // tslint:disable-next-line:no-any
    static fromJSON(obj) {
        const { signature, publicKey, signatureIndex, transaction } = obj;
        return new SignedTransaction(vbkcrypto.Signature.fromStringHex(signature), vbkcrypto.PublicKey.fromStringHex(publicKey), signatureIndex, Transaction.fromJSON(transaction));
    }
}
exports.SignedTransaction = SignedTransaction;
exports.signTransaction = (transaction, keyPair, signatureIndex) => {
    vbkutil.assertByteValid(signatureIndex);
    const id = exports.getTransactionId(transaction, signatureIndex);
    const signature = vbkcrypto.SHA256withECDSA.sign(id, keyPair);
    return new SignedTransaction(signature, keyPair.publicKey, signatureIndex, transaction);
};