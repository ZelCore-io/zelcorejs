var zelcorejs = require('..')
var chai = require('chai')
const BigNumber = require('bignumber.js');
var expect = chai.expect

it('VBK - Constructs and signs VBK standard transactions', function () {
  const transaction = zelcorejs.veriblocktxs;
  const crypto = zelcorejs.veriblockcrypto;
  const address = zelcorejs.veriblockaddress;
  var PRIVATE_KEY = Buffer.from('303E020100301006072A8648CE3D020106052B8104000A04273025020101042017869E398A7ACD18729B8FC6D47DCFE9C1A2B5871334D00471EFC3985762FF8F', 'hex');
  var kp = crypto.KeyPair.fromPrivateKey(PRIVATE_KEY);
  var sourceAddress = address.addressFromPublicKey(kp.publicKey);
  const sourceAmount = (new BigNumber(10000000000)).toString();
  const destAmount = (new BigNumber(10000000)).toString();
  const recipientAddress = 'VALXnENuqFexnM9Nih6DVG6RfAy9jV';
  const rawTx = {
    sourceAddress,
    sourceAmount,
    data: "",
    outputs: [
      {
        address: recipientAddress,
        amount: destAmount,
      },
    ],
  };
  // deserialize rawTx
  const modelTx = transaction.tryDeserializeTransaction(rawTx);
  const signatureIndex = 0;
  var signed = transaction.signTransaction(modelTx, kp, signatureIndex);
  const txid = signed.transaction.txId;

  expect(txid).to.equal('94230445fb9f83bcb4a2e9f043b030cd61e7ccf6c94bb48710d17b0719ed4aa0');
  expect(JSON.stringify(signed)).to.equal('{"signature":{"_canonical":{"type":"Buffer","data":[111,45,70,64,195,191,123,72,221,213,180,112,152,202,95,100,60,99,238,131,37,32,167,231,213,127,211,225,202,14,182,159,40,211,39,84,77,149,145,15,122,20,95,218,56,176,197,81,5,222,111,59,104,187,193,55,129,80,227,251,140,98,69,201]}},"publicKey":{"_full":{"type":"Buffer","data":[48,86,48,16,6,7,42,134,72,206,61,2,1,6,5,43,129,4,0,10,3,66,0,4,75,100,149,21,163,10,67,97,221,135,95,143,173,22,195,113,66,17,98,23,229,184,6,156,68,71,115,181,153,17,188,206,56,120,45,123,160,108,11,155,119,19,5,208,101,39,156,233,242,40,140,142,171,83,40,210,96,98,144,133,247,101,53,4]}},"signatureIndex":0,"transaction":{"sourceAddress":"V5ZguGxnAckADJMkFFG6Vpr9EGyk6v","sourceAmount":"10000000000","data":"","outputs":[{"address":"VALXnENuqFexnM9Nih6DVG6RfAy9jV","amount":"10000000"}],"transactionFee":"9990000000","txId":"94230445fb9f83bcb4a2e9f043b030cd61e7ccf6c94bb48710d17b0719ed4aa0","type":1}}');
})