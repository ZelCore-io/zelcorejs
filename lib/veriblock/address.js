// VeriBlock Blockchain Project
// Copyright 2017-2018 VeriBlock, Inc
// Copyright 2018-2019 Xenios SEZC
// All rights reserved.
// https://www.veriblock.org
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
const bs58 = require('./base58');
const vbkcrypto = require('./crypto');
const constants = require('./const');
const vbkhash = require('./hash');
const except = require('./exception');
const getDataPortionFromAddress = (address) => {
    return address.substr(constants.ADDRESS_DATA_START, constants.ADDRESS_DATA_END + 1);
};
const getChecksumPortionFromAddress = (address) => {
    return address.substr(constants.ADDRESS_CHECKSUM_START);
};
const chopChecksumStandard = (checksum) => {
    if (checksum.length < constants.ADDRESS_CHECKSUM_LENGTH) {
        throw new except.InvalidChecksumException();
    }
    return checksum.substr(0, constants.ADDRESS_CHECKSUM_LENGTH + 1);
};
const getChecksumPortionFromMultisigAddress = (address) => {
    return address.substr(constants.MULTISIG_ADDRESS_CHECKSUM_START, constants.MULTISIG_ADDRESS_CHECKSUM_END + 1);
};
const chopChecksumMultisig = (checksum) => {
    return checksum.substr(0, constants.MULTISIG_ADDRESS_CHECKSUM_LENGTH + 1);
};
exports.isValidStandardAddress = (address) => {
    if (!address) {
        return false;
    }
    if (address.length !== constants.ADDRESS_LENGTH) {
        return false;
    }
    if (address[0] !== constants.STARTING_CHAR) {
        return false;
    }
    const sub = getDataPortionFromAddress(address);
    const hash = vbkhash.sha256(Buffer.from(sub));
    const b58 = bs58.Base58.encode(hash);
    return chopChecksumStandard(b58) === getChecksumPortionFromAddress(address);
};
exports.isValidMultisigAddress = (address) => {
    if (!address) {
        return false;
    }
    if (address.length !== constants.MULTISIG_ADDRESS_LENGTH) {
        return false;
    }
    if (address[address.length - 1] !== constants.ENDING_CHAR_MULTISIG) {
        return false;
    }
    const m = bs58.Base58.decode(address[constants.MULTISIG_ADDRESS_M_VALUE])[0] + 1;
    const n = bs58.Base58.decode(address[constants.MULTISIG_ADDRESS_N_VALUE])[0] + 1;
    if (n < constants.MULTISIG_ADDRESS_MIN_N_VALUE) {
        return false;
    }
    if (m > n) {
        return false;
    }
    if (n > constants.MULTISIG_ADDRESS_MAX_N_VALUE || m > constants.MULTISIG_ADDRESS_MAX_M_VALUE) {
        return false;
    }
    const base = address.substr(constants.MULTISIG_ADDRESS_DATA_START, constants.MULTISIG_ADDRESS_CHECKSUM_END + 1);
    if (!bs58.Base58.decodeUnsafe(base)) {
        // weren't able to decode
        return false;
    }
    const checksum = address.substr(constants.MULTISIG_ADDRESS_DATA_START, constants.MULTISIG_ADDRESS_DATA_END + 1);
    return (chopChecksumMultisig(checksum) ===
        getChecksumPortionFromMultisigAddress(address));
};
exports.addressFromPublicKey = (publicKey) => {
    if (publicKey instanceof Buffer) {
        publicKey = new vbkcrypto.PublicKey(publicKey);
    }
    const b58 = bs58.Base58.encode(vbkhash.sha256(publicKey.asn1));
    const slice = b58.slice(constants.ADDRESS_DATA_START, constants.ADDRESS_DATA_END);
    const address = constants.STARTING_CHAR + slice;
    const checksum = chopChecksumStandard(bs58.Base58.encode(vbkhash.sha256(Buffer.from(address))));
    return address + checksum;
};