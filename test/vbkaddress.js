var zelcorejs = require('..')
var chai = require('chai')
var expect = chai.expect

it('VBK - addressFromPublicKey() should be deterministic', function () {
  const pub = Buffer.from('03317b3fd39dd25719563f46534e6d9779695ef3b5b8886c2293fc79e0c5c32836', 'hex');
  var address = zelcorejs.veriblockaddress.addressFromPublicKey(pub);
  expect(address).to.equal('VBZ3J16cLrhxeEwZvswQSucfrFKvMF');
})

it('VBK - isValidStandardAddress() recognises valid addresses', function () {
  var address = 'VBZ3J16cLrhxeEwZvswQSucfrFKvMF';
  var boolean = zelcorejs.veriblockaddress.isValidStandardAddress(address);
  var address2 = 'aBZ3J16cLrhxeEwZvswQSucfrFKvMF';
  var boolean2 = zelcorejs.veriblockaddress.isValidStandardAddress(address2);
  expect(boolean).to.equal(true);
  expect(boolean2).to.equal(false);
})

it('VBK - import Nodecore privatekey', () => {
  const privateNodecoreKey =
    '40303E020100301006072A8648CE3D020106052B8104000A0427302502010104205E5356079422753D981D93BDEBF7DE38D4AB063A73540DB50F446D4F4618684C3056301006072A8648CE3D020106052B8104000A0342000461CA7B88C1B097CE7D72860C05D50AF154C63D112E149EE4A36F51E12D960C9065CAFE6CD9D11B54F03DB1A2A82A374E0357C9C63A2D6A1D1C9DF4C889910CAA';
  const keyPair = zelcorejs.veriblockcrypto.KeyPair.importFromNodecorePrivateKey(privateNodecoreKey);

  expect(keyPair.publicKey.getAddress()).to.equal(
    'V3kHRaCL6ddmqMRnCSyD8417Z9nJCZ'
  );
});

it('VBK - export to Nodecore', () => {
  // any valid private key
  const privateNodecoreKey =
    '40303E020100301006072A8648CE3D020106052B8104000A0427302502010104205E5356079422753D981D93BDEBF7DE38D4AB063A73540DB50F446D4F4618684C3056301006072A8648CE3D020106052B8104000A0342000461CA7B88C1B097CE7D72860C05D50AF154C63D112E149EE4A36F51E12D960C9065CAFE6CD9D11B54F03DB1A2A82A374E0357C9C63A2D6A1D1C9DF4C889910CAA';
  const privHex =
    '303e020100301006072a8648ce3d020106052b8104000a0427302502010104205e5356079422753d981d93bdebf7de38d4ab063a73540db50f446d4f4618684c';
  const priv = zelcorejs.veriblockcrypto.PrivateKey.fromStringHex(privHex);

  const kp = zelcorejs.veriblockcrypto.KeyPair.fromPrivateKey(priv);
  const nodecoreFormat = kp.exportToNodecore();

  expect(nodecoreFormat.address).to.equal('V3kHRaCL6ddmqMRnCSyD8417Z9nJCZ');
  expect(nodecoreFormat.private_key).to.equal(privateNodecoreKey);
});