"use strict";
const t = require("io-ts");
const vbkaddress = require("./address");
const vbkcrypto = require("./crypto");
const BigNumber = require("bignumber.js");
const Either_1 = require("fp-ts/lib/Either");
const PathReporter_1 = require("io-ts/lib/PathReporter");
const vbkconstants = require("./const");
exports.addressT = new t.Type('address', t.string.is, 
// `t.success` and `t.failure` are helpers used to build `Either` instances
(input, context) => {
    if (typeof input !== 'string') {
        return t.failure(input, context, 'not a string');
    }
    if (!vbkaddress.isValidStandardAddress(input)) {
        return t.failure(input, context, 'invalid address format');
    }
    return t.success(input);
}, t.identity);
exports.amountT = new t.Type('amount', (input) => input instanceof BigNumber.default, (input, context) => {
    if (typeof input !== 'string') {
        return t.failure(input, context, 'not a string');
    }
    try {
        const bn = new BigNumber.default(input);
        if (bn.isNegative()) {
            return t.failure(input, context, 'can not be negative');
        }
        if (bn.gt(vbkconstants.AMOUNT_MAX)) {
            return t.failure(input, context, `can not be greater than ${vbkconstants.AMOUNT_MAX.toString()}`);
        }
        return t.success(bn);
    }
    catch (e) {
        return t.failure(input, context, 'can not be negative');
    }
}, a => a.toString());
exports.dataT = new t.Type('data', t.string.is, 
// `t.success` and `t.failure` are helpers used to build `Either` instances
(input, context) => {
    if (typeof input !== 'undefined') {
        if (typeof input !== 'string') {
            return t.failure(input, context, 'not a string');
        }
        try {
            Buffer.from(input, 'hex');
        }
        catch (e) {
            return t.failure(input, context, 'data can not be non-hexadecimal string');
        }
        return t.success(input);
    }
    return t.success('');
}, t.identity);
exports.signatureIndexT = new t.Type('signatureIndex', (input) => typeof input === 'number', (input, context) => {
    if (typeof input !== 'number') {
        return t.failure(input, context, 'not a number');
    }
    if (input < 0) {
        return t.failure(input, context, 'must be positive');
    }
    return t.success(input);
}, t.identity);
exports.outputT = t.type({
    address: exports.addressT,
    amount: exports.amountT,
});
exports.byteT = new t.Type('byte', (input) => typeof input === 'number', (input, context) => {
    if (typeof input !== 'number') {
        return t.failure(input, context, 'not a number');
    }
    if (input < 0 || input >= 256) {
        return t.failure(input, context, 'does not fit in 0<=N<256');
    }
    return t.success(input);
}, t.identity);
exports.transactionT = t.exact(t.type({
    sourceAddress: exports.addressT,
    sourceAmount: exports.amountT,
    outputs: t.array(exports.outputT),
    networkByte: t.union([exports.byteT, t.undefined]),
    data: exports.dataT,
    transactionFee: t.union([exports.amountT, t.undefined]),
    txId: t.union([t.string, t.undefined]),
    type: t.union([t.number, t.undefined]),
}));
exports.signatureT = new t.Type('signature', (input) => typeof input === 'string', (input, context) => {
    if (typeof input !== 'string') {
        return t.failure(input, context, 'not a string');
    }
    try {
        return t.success(vbkcrypto.Signature.fromStringHex(input));
    }
    catch (e) {
        return t.failure(input, context, e);
    }
}, a => a.toStringHex());
exports.publicKeyT = new t.Type('signature', (input) => typeof input === 'string', (input, context) => {
    if (typeof input !== 'string') {
        return t.failure(input, context, 'not a string');
    }
    try {
        return t.success(vbkcrypto.PublicKey.fromStringHex(input));
    }
    catch (e) {
        return t.failure(input, context, e);
    }
}, a => a.toStringHex());
exports.privateKeyT = new t.Type('signature', (input) => typeof input === 'string', (input, context) => {
    if (typeof input !== 'string') {
        return t.failure(input, context, 'not a string');
    }
    try {
        return t.success(vbkcrypto.PrivateKey.fromStringHex(input));
    }
    catch (e) {
        return t.failure(input, context, e);
    }
}, a => a.toStringHex());
exports.signedTransactionT = t.exact(t.type({
    signature: exports.signatureT,
    publicKey: exports.publicKeyT,
    signatureIndex: exports.signatureIndexT,
    transaction: exports.transactionT,
}));
// add hexStringT
exports.nodecoreKeypairT = t.exact(t.type({
    address: exports.addressT,
    private_key: t.string,
}));
// tslint:disable-next-line:variable-name
exports.ThrowReporter = {
    report: validation => {
        if (Either_1.isLeft(validation)) {
            throw new Error(PathReporter_1.PathReporter.report(validation).join('\n'));
        }
    },
};