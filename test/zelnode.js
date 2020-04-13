var zeltrezjs = require('..')
var chai = require('chai')
var expect = chai.expect


it('ZelNode - calculate ZelNode Public Key', function () {
  const privateKey = 'BASIC6';
  const publicKey = zeltrezjs.zelnode.getZelNodePublicKey(privateKey);
  expect(publicKey).to.equal('04cfc5a65bc0608aa812f09160f85e505cab3991acdd8394c6546e10d78bc6db65c6860f0437ded9c9e62ecfb1ad0d7c8700a3a2a79d26e7fb60f9e14537f4cad0');
})

it('ZelNode - calculate Collateral Public Key', function () {
  const privateKey = 'BASIC6';
  const publicKey = zeltrezjs.zelnode.getCollateralPublicKey(privateKey);
  expect(publicKey).to.equal('02af71370d7e4c56959751c46cc35eed78dfb9fa54c06674fc99c0486e8626749f');
})


it('ZelNode - create start transaction', function () {
  const collateralOutHash = 'BASIC6'
  const collateralOutIndex = '0';
  const collateralPrivateKey = 'BASIC6';
  const zelnodePrivateKey = 'BASIC6';
  const timestamp = '1584866597';
  const tx = zeltrezjs.zelnode.startZelNode(collateralOutHash, collateralOutIndex, collateralPrivateKey, zelnodePrivateKey, timestamp);
  expect(tx).to.equal('050000000244bd2dbb77b7f0388d68a72e3845d079dd38b2c55f4bd682fe482e18750aae99000000002102af71370d7e4c56959751c46cc35eed78dfb9fa54c06674fc99c0486e8626749f4104cfc5a65bc0608aa812f09160f85e505cab3991acdd8394c6546e10d78bc6db65c6860f0437ded9c9e62ecfb1ad0d7c8700a3a2a79d26e7fb60f9e14537f4cad02525775e41200c3310bfb2b2c117eaa2134dd56cda95b1a45579312c65bcce749e3c40dba1572ba97384c6118938f94bb890810a6f910269a2e9e307f47a3bd441896385c3f2');
})

it('ZelNode - sign message', function () {
  const msg = "050000000244bd2dbb77b7f0388d68a72e3845d079dd38b2c55f4bd682fe482e18750aae99000000002102af71370d7e4c56959751c46cc35eed78dfb9fa54c06674fc99c0486e8626749f4104cfc5a65bc0608aa812f09160f85e505cab3991acdd8394c6546e10d78bc6db65c6860f0437ded9c9e62ecfb1ad0d7c8700a3a2a79d26e7fb60f9e14537f4cad02525775e";
  const privateKey = 'BASIC6';
  const signature = zeltrezjs.zelnode.signMessage(msg, privateKey);
  expect(signature).to.equal('H2QFEWlAkcRvesxHxQgH/kh6Rikfsi8d7P8rJHbG5LDEfAu2rUcBGpzHKrt+9JzJMAIiQbB/CwuZD1/L8eqINmE=');
})

it('ZelNode - sign Start message', function () {
  const msg = "0500000002cfaf38ee6881bfbfdd6c95693e2d82a8baec6f88845c00162e6b8b801aebcac00000000021027167031f4300cc7e796af3ec8788c87793728f0cdf0028bc56143973323a54694104ab072dffdea7c1b3fdfadc361c740f6208ef49bdcea1807152a4a56152fd2fe336b53f3cdad1cf500c90cb20a60d4878b09e531ac810dc6e9cf0b1874afedd81641d945e";
  const privateKey = 'BASIC5';
  const signature = zeltrezjs.zelnode.signStartMessage(msg, privateKey);
  expect(signature).to.equal('20b6e507f5b5dc22077ce94f82ff20bbc95681ee9d77a794fd6b02848d7afde0a40d4a2cffbc28af38c45151ee9801ad85f2493d6d788205329f7bd6730cdf2226');
  // expect(signature).to.equal('ILblB/W13CIHfOlPgv8gu8lWge6dd6eU/WsChI16/eCkDUos/7worzjEUVHumAGthfJJPW14ggUyn3vWcwzfIiY=');
})

it('doubleHash', function () {
  const msg = "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d014dffffffff0100f2052a01000000434104e70a02f5af48a1989bf630d92523c9d14c45c75f7d1b998e962bff6ff9995fc5bdb44f1793b37495d80324acba7c8f537caaf8432b8d47987313060cc82d8a93ac00000000";
  const hash = zeltrezjs.zelnode.doubleHash(msg);
  expect(hash).to.equal('660802c98f18fd34fd16d61c63cf447568370124ac5f3be626c2e1c3c9f0052d');
})

// // start tx is not having signature
// it('doubleHash1', function () {
//   const msg = "0500000002b3ae41c6046000fd129425d08fd2142fc886cf2aea8d43a6951fc770e22cf914000000002103ffbec8caa95c594c574fa486b8540551dabdfa7aa86c3261b73bc96af32ab7a741047d88ba7d428352c09b402e84344dea5afb0ae8f7602893ab74804d1f7a7fb08e61857dac35012eb3b0c4ba603b38fd9575b92a53d1410fb5bdac38687998e35c2f00735e";
//   const hash = zeltrezjs.zelnode.doubleHash(msg);
//   expect(hash).to.equal('a89fcfa77810e5b6bae6a4be065d8db9f0aa7a11bedce37b9ddf91372fe0fa4e'); // reverse hash actually
// })

// // Confirm tx is not having both signatures
// it('doubleHash2', function () {
//   const msg = "0500000004b3ae41c6046000fd129425d08fd2142fc886cf2aea8d43a6951fc770e22cf9140000000092e0915e0221dc915e010b3134342e39312e39372e37";
//   const hash = zeltrezjs.zelnode.doubleHash(msg);
//   expect(hash).to.equal('9c4dcbd1eab60e969207c90ed0e3ad8f6f8913372b255dc967a2cdbeeccebf3e'); // reverse hash actually
// })