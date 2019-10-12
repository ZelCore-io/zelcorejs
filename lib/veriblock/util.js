// VeriBlock Blockchain Project
// Copyright 2017-2018 VeriBlock, Inc
// Copyright 2018-2019 Xenios SEZC
// All rights reserved.
// https://www.veriblock.org
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
const streamBuffers = require('stream-buffers');
const constants = require('./const');
const bs58 = require('./base58');
const bs59 = require('./base59')
const vbkaddress = require('./address');
const BigNumber = require('bignumber.js');
const bigNumberRightShift = (b, bits) => {
    const p = new BigNumber(2).pow(bits);
    return b.dividedToIntegerBy(p);
};
exports.trimmedByteArrayFromNumber = (n) => {
    let x = 8;
    if (n.isNegative()) {
        // if n=-1, make it = 0xffffffffffffffff
        n = new BigNumber('0xffffffffffffffff', 16).plus(n).plus(1);
    }
    do {
        const c = bigNumberRightShift(n, (x - 1) * 8);
        if (c.comparedTo(0) !== 0) {
            break;
        }
        x--;
    } while (x > 1);
    const trimmedByteArray = Buffer.alloc(Number(x));
    for (let i = 0; i < x; i++) {
        const c = n.mod(256).toNumber(); // equivalent of (n & 0xff)
        trimmedByteArray.writeUInt8(c, x - i - 1);
        n = bigNumberRightShift(n, 8);
    }
    return trimmedByteArray;

};
exports.writeVarLenNumberValueToStream = (stream, n) => {
    const b = exports.trimmedByteArrayFromNumber(n);
    exports.writeBuffer(stream, b);
};
exports.writeVarLenBufferValueToStream = (stream, n) => {
    const dataSize = exports.trimmedByteArrayFromNumber(new BigNumber(n.length));
    stream.write(Buffer.from([dataSize.length & 0xff]));
    stream.write(dataSize);
    stream.write(n);
};
exports.writeBuffer = (stream, b) => {
    stream.write(Buffer.from([b.length]));
    stream.write(b);
};
const writeAmount = (stream, amount) => {
    exports.writeVarLenNumberValueToStream(stream, exports.makeBigNumber(amount));
};
const writeAddress = (stream, address) => {
    let bytes;
    if (vbkaddress.isValidStandardAddress(address)) {
        stream.write(Buffer.from([constants.STANDARD_ADDRESS_ID]));
        bytes = bs58.Base58.decode(address);
    }
    else if (vbkaddress.isValidMultisigAddress(address)) {
        stream.write(Buffer.from([constants.MULTISIG_ADDRESS_ID]));
        bytes = bs59.Base59.decode(address);
    }
    else {
        throw new Error('invalid address');
    }
    exports.writeBuffer(stream, bytes);
};
exports.serializeTransactionEffects = (tx, signatureIndex) => {
    const stream = new streamBuffers.WritableStreamBuffer({
        initialSize: 1000,
    });
    stream.write(Buffer.from([tx.type]));
    // write transaction address
    writeAddress(stream, tx.sourceAddress);
    // write transaction amount
    writeAmount(stream, tx.sourceAmount);
    // write destinations
    stream.write(Buffer.from([tx.outputs.length]));
    tx.outputs.forEach(o => {
        writeAddress(stream, o.address);
        writeAmount(stream, o.amount);
    });
    exports.writeVarLenNumberValueToStream(stream, new BigNumber(signatureIndex));
    // put empty buffer
    exports.writeVarLenBufferValueToStream(stream, Buffer.alloc(0));
    stream.end();
    const result = stream.getContents();
    if (result && result instanceof Buffer) {
        return result;
    }
    else {
        throw new Error('buffer error');
    }
};
exports.assertTrue = (condition, msg) => {
    if (!condition) {
        throw new Error(msg);
    }
};
exports.assertInt = (n, msg) => {
    exports.assertTrue(Number.isInteger(n), `${msg ? `[${msg}] ` : ''}should be an integer`);
};
exports.assertPositive = (n, msg) => {
    exports.assertTrue(n > 0, `${msg ? `[${msg}] ` : ''}number should be positive`);
};
exports.assertMaxNumber = (n, max, msg) => {
    exports.assertTrue(n < max, `${msg ? `[${msg}] ` : ''}number is > ${max}`);
};
exports.assertNumberInRange = (n, from, to) => {
    exports.assertTrue(n.gte(from) && n.lte(to), `number should be ${from} <= N (${n}) <= ${to}`);
};
exports.assertAddressValid = (addr) => {
    exports.assertTrue(vbkaddress.isValidStandardAddress(addr) || vbkaddress.isValidMultisigAddress(addr), 'invalid address');
};
exports.assertByteValid = (byte) => {
    exports.assertNumberInRange(new BigNumber(byte), new BigNumber(0), new BigNumber(255));
};
exports.assertAmountValid = (amount) => {
    exports.assertNumberInRange(exports.makeBigNumber(amount), new BigNumber(0), constants.AMOUNT_MAX);
};
exports.makeBigNumber = (amount) => {
    switch (typeof amount) {
        case 'bigint':
        case 'string':
        case 'number':
        case 'object':
            return new BigNumber(amount);
        default:
            throw new Error('unknown amount type');
    }
};