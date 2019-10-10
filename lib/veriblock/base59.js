// VeriBlock Blockchain Project
// Copyright 2017-2018 VeriBlock, Inc
// Copyright 2018-2019 Xenios SEZC
// All rights reserved.
// https://www.veriblock.org
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
const base_x = require('base-x');
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0';
const bs59 = base_x(ALPHABET);
class Base59 {
}
Base59.encode = (b) => {
    return bs59.encode(b);
};
Base59.decode = (s) => {
    return bs59.decode(s);
};
Base59.decodeUnsafe = (s) => {
    return bs59.decodeUnsafe(s);
};
exports.isBase59String = (s) => {
    for (let i = 0; i < s.length; ++i) {
        if (ALPHABET.indexOf(s[i]) === -1) {
            return false;
        }
    }
    return true;
};
exports.Base59 = Base59;