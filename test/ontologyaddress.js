var zelcorejs = require('..')
var chai = require('chai')
var expect = chai.expect

it('Ontology - publicKeyFromPrivateKey() should be deterministic', function () {
  const privateKey = '090587b6e6b42941b7174d59e1a6512e217e830828ad018db15bdbfd52d732d6';
  const publicKey = zelcorejs.ontologyaddress.publicKeyFromPrivateKey(privateKey);
  expect(publicKey).to.equal('0242a61b7f77db59160470222628fbfd87ace4579b5e95590529eaa954a367a79e');
})

it('Ontology - addressFromPublicKey() should be deterministic', function () {
  const publicKey = '0242a61b7f77db59160470222628fbfd87ace4579b5e95590529eaa954a367a79e';
  const address = zelcorejs.ontologyaddress.addressFromPublicKey(publicKey);
  expect(address).to.equal('AbDJSnTrz78XZYhQ6qa4pLFuiA5xdsVHrs');
})