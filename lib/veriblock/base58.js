// VeriBlock Blockchain Project
// Copyright 2017-2018 VeriBlock, Inc
// Copyright 2018-2019 Xenios SEZC
// All rights reserved.
// https://www.veriblock.org
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
const basex = require('base-x');
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const bs58 = basex(ALPHABET);
class Base58 {
}
Base58.encode = (b) => {
    return bs58.encode(b);
};
Base58.decode = (s) => {
    return bs58.decode(s);
};
Base58.decodeUnsafe = (s) => {
    return bs58.decodeUnsafe(s);
};
exports.Base58 = Base58;