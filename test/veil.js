var veiljs = require('..')
var chai = require('chai')
var expect = chai.expect
var veilconfig = require('../lib/veil/config')

it('Veil - MkPrivateKey() should be deterministic', function () {
  var priv = veiljs.veiladdress.mkPrivKey(
    'chris p. bacon, defender of the guardians'
  )
  expect(priv).to.equal(
    '2c3a48576fe6e8a466e78cd2957c9dc62128135540bbea0685d7c4a23ea35a6c'
  )
})

it('Veil - PrivateKeyToWIFFormat() should be deterministic', function () {
  var priv = veiljs.veiladdress.privKeyToWIF(
    '2c3a48576fe6e8a466e78cd2957c9dc62128135540bbea0685d7c4a23ea35a6c'
  )
  expect(priv).to.equal('5J9mKPd531Tk4A73kKp4iowoi6EvhEp8QSMAVzrZhuzZkdpYbK8')
})

it('Veil - PrivateKeyToPublicKey() should be deterministic', function () {
  var priv = veiljs.veiladdress.privKeyToPubKey(
    '2c3a48576fe6e8a466e78cd2957c9dc62128135540bbea0685d7c4a23ea35a6c'
  )
  expect(priv).to.equal(
    '048a789e0910b6aa314f63d2cc666bd44fa4b71d7397cb5466902dc594c1a0a0d2e4d234528ff87b83f971ab2b12cd2939ff33c7846716827a5b0e8233049d8aad'
  )
})

it('Veil - PublicKeyToPublicAddress() should be deterministic (testnet)', function () {
  var priv = veiljs.veiladdress.pubKeyToAddr(
    '02e2630b31d3c1364a848f761fc00baf2453195bfe405c43ecd6a1763e07b34cbd'
    , veilconfig.testnet.pubKeyHash)
  expect(priv).to.equal('mtcoZ2J4oU2saSgxSS4ry49Z9dhe5HVft7')
})

it('Veil - PublicKeyToPublicAddress() should be deterministic (mainnet)', function () {
  var priv = veiljs.veiladdress.pubKeyToAddr(
    '03b5d3607ee527ab682d7858170585223816c591d53fd04135fc0fe1224b096690'
    , veilconfig.mainnet.pubKeyHash)
  expect(priv).to.equal('VRdv2cDKvcpq5aP5w22M4ELeWRfQtQZF3y')
})

it('Veil - serializeTx() and desrializeTx() should be deterministic', function () {
  var txobj = veiljs.transactionveil.createRawTx(
    [{
      txid: '41b914bc9004c43ab63aa18cab631f54f8a5e39194d6f92078225cab2b6e5888',
      vout: 1,
      scriptPubKey: '76a9147c77e813ecf8895eba57c55ecb503c0237af17af88ac'
    }],
    [{ address: 'n1z41WRfVt2REvxVN7i9wiXpuFm2akqkyx', satoshis: 4990000000, pubKeyHash: veiljs.veilconfig.testnet.pubKeyHash }],
  )
  var txobj_serialized = veiljs.transactionveil.serializeTx(txobj)
  var txobj_deserialized = veiljs.transactionveil.deserializeTx(txobj_serialized)

  // Remove prevScriptPubKey since its not really an attribute
  for (var i = 0; i < txobj.ins.length; i++) {
    txobj.ins[i].prevScriptPubKey = ''
  }

  expect(txobj_serialized).to.equal('020000000000000188586e2bab5c227820f9d69491e3a5f8541f63ab8ca13ab63ac40490bc14b9410100000000ffffffff0101805b6d29010000001976a914e082845ddbcf106296bf84b8dd1d49c25ae3523e88ac')
  expect(txobj_deserialized).to.deep.equal(txobj)
})

it('Veil - signTx() should be deterministic', function () {
  // Create raw transaction at current height
  var txobj = veiljs.transactionveil.createRawTx(
    [{
      txid: '41b914bc9004c43ab63aa18cab631f54f8a5e39194d6f92078225cab2b6e5888',
      vout: 1,
      scriptPubKey: '76a9147c77e813ecf8895eba57c55ecb503c0237af17af88ac'
    }],
    [{ address: 'n1z41WRfVt2REvxVN7i9wiXpuFm2akqkyx', satoshis: 4990000000, pubKeyHash: veiljs.veilconfig.testnet.pubKeyHash }]
  )

  const compressPubKey = true
  const SIGHASH_ALL = 1
  var serialzied = veiljs.transactionveil.serializeTxForSig(txobj)

  var signedobj = veiljs.transactionveil.signTx(txobj, 0, '9EC9BD7F461811C93AEA544C74B35C0728A3B0F0A925B1163E2923735E1AC8A6', compressPubKey, SIGHASH_ALL)
  var signed_serialized = veiljs.transactionveil.serializeTx(signedobj)

  expect(signed_serialized).to.equal('020000000000000188586e2bab5c227820f9d69491e3a5f8541f63ab8ca13ab63ac40490bc14b941010000006b4830450221009d4151e1f8e3eaeb46a11fa14ed85c9e6722cba9519cad3cfe39fe1244ff8069022004ab8e7839ba19855d1cb5260a364ef77c6105d2fbc85b6be48adf690648027a012103417994c143dbe9227a844f7b0a75bdbcf059f3dbc51c4e62ebe276016097926fffffffff0101805b6d29010000001976a914e082845ddbcf106296bf84b8dd1d49c25ae3523e88ac')
})