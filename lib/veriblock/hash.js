// VeriBlock Blockchain Project
// Copyright 2017-2018 VeriBlock, Inc
// Copyright 2018-2019 Xenios SEZC
// All rights reserved.
// https://www.veriblock.org
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
const zelcorecrypto = require("../crypto")
exports.sha256 = (buffer) => {
    return Buffer.from(zelcorecrypto.sha256(buffer), "hex");
};