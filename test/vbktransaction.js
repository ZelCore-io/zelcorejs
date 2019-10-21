var zeltrezjs = require('..')
var chai = require('chai')
const BigNumber = require('bignumber.js');
var expect = chai.expect

it('VBK - Constructs and signs VBK standard transactions', function () {
  const transaction = zeltrezjs.veriblocktransaction;
  const crypto = zeltrezjs.veriblockcrypto;
  const address = zeltrezjs.veriblockaddress;
  // const basic = zeltrezjs.veriblockbasic;
  // const PRIVATE_KEY = Buffer.from('303E020100301006072A8648CE3D020106052B8104000A04273025020101042017869E398A7ACD18729B8FC6D47DCFE9C1A2B5871334D00471EFC3985762FF8F', 'hex');
  // const kp = crypto.KeyPair.fromPrivateKey(PRIVATE_KEY);
  // const addr = address.Address.fromPublicKey(kp.publicKey);
  // const outputs = [new basic.Output(addr, 100)];
  // const tx = new transaction.Transaction(1, addr, 100, outputs, 1);
  // const signatureIndex = 0;
  // const signed = transaction.signTransaction(tx, kp, signatureIndex);
  // expect(transaction.getTransactionId(signed.transaction, signatureIndex).toString('hex')).to.equal('4cb778a158601701c98028b778e583859ef814ba1a57284fadef720a1dd5fbb7');
  // expect(signed.publicKey.asn1.toString('hex')).to.equal('3056301006072a8648ce3d020106052b8104000a034200044b649515a30a4361dd875f8fad16c37142116217e5b8069c444773b59911bcce38782d7ba06c0b9b771305d065279ce9f2288c8eab5328d260629085f7653504');
  // expect(signed.publicKey.address).to.equal('V5ZguGxnAckADJMkFFG6Vpr9EGyk6v');
  // expect(signed.signature.asn1.toString('hex')).to.equal('304502204348ceb1eaaf54cca7811aeae8590a3289840fc5f0a5ebb711c5a5e7f7fa0f329cb754428ceb80337f754313390ba52d2bb201eaa79c89b95603b8fd3d8f8f0670ecfa');

  const constants = zeltrezjs.veriblockconstants;
  var PRIVATE_KEY = Buffer.from('303E020100301006072A8648CE3D020106052B8104000A04273025020101042017869E398A7ACD18729B8FC6D47DCFE9C1A2B5871334D00471EFC3985762FF8F', 'hex');
  var kp = crypto.KeyPair.fromPrivateKey(PRIVATE_KEY);
  var sourceAddress = address.addressFromPublicKey(kp.publicKey);
  var tx = new transaction.Transaction(sourceAddress, constants.AMOUNT_MAX, [new transaction.Output(sourceAddress, new BigNumber(100))], 1);
  var signatureIndex = 0;
  var signed = transaction.signTransaction(tx, kp, signatureIndex);

  var str = signed.stringify();
  var deserialized = transaction.SignedTransaction.parse(str);
  expect(deserialized.stringify()).to.equal(str);
  expect(deserialized.stringify()).to.equal('{"signature":"30450221009c3d7cdb6bd7939f7acabd7e3b6eb00900f5cb496d6bd99354fe3f073b7b89d30220268c65be85c2b677459ccd5ababd7f764eb227b3e051dbe14a7f63b97a4865eb","publicKey":"3056301006072a8648ce3d020106052b8104000a034200044b649515a30a4361dd875f8fad16c37142116217e5b8069c444773b59911bcce38782d7ba06c0b9b771305d065279ce9f2288c8eab5328d260629085f7653504","signatureIndex":0,"transaction":{"type":1,"sourceAddress":"V5ZguGxnAckADJMkFFG6Vpr9EGyk6v","sourceAmount":9223372036854775807,"outputs":[{"address":"V5ZguGxnAckADJMkFFG6Vpr9EGyk6v","amount":100}],"networkByte":1}}');
})