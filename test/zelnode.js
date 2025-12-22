var zelcorejs = require('..')
var chai = require('chai')
var expect = chai.expect


it('ZelNode - calculate ZelNode Public Key', function () {
  const privateKey = '5JF3aGCa6bkPvfSzqtzX7fXFjfjUG4qzp9hdtRujLRE9ZAMfhiF';
  const publicKey = zelcorejs.zelnode.getZelNodePublicKey(privateKey);
  expect(publicKey).to.equal('04f6c04f8a3569a518ec0987fc2544900e8a3f742a6e0d891a700d9a94482a0abdae64a1c106a4d4339963afd32391e0e660fabbc75c73200fc863287cfd54a7f2');
})

it('ZelNode - calculate Collateral Public Key', function () {
  const privateKey = 'L17FU2CoD4joDmEp1xMbfuD6eQ8Yr8SEC2gjbcKktLs3DS3WCCxF';
  const publicKey = zelcorejs.zelnode.getCollateralPublicKey(privateKey);
  expect(publicKey).to.equal('03c7f8f9e5368a2bee1ba3b3127b5039f84e8f1dad0e11f64e5586b76f654ee2a3');
})

it('ZelNode - create start transaction', function () {
  const collateralOutHash = '99ae0a75182e48fe82d64b5fc5b238dd79d045382ea7688d38f0b777bb2dbd44';
  const collateralOutIndex = '0'; // string
  const collateralPrivateKey = 'L17FU2CoD4joDmEp1xMbfuD6eQ8Yr8SEC2gjbcKktLs3DS3WCCxF';
  const zelnodePrivateKey = '5JF3aGCa6bkPvfSzqtzX7fXFjfjUG4qzp9hdtRujLRE9ZAMfhiF';
  const timestamp = '1584866597'; // in seconds
  const tx = zelcorejs.zelnode.startZelNode(collateralOutHash, collateralOutIndex, collateralPrivateKey, zelnodePrivateKey, timestamp);
  expect(tx).to.equal('050000000244bd2dbb77b7f0388d68a72e3845d079dd38b2c55f4bd682fe482e18750aae99000000002103c7f8f9e5368a2bee1ba3b3127b5039f84e8f1dad0e11f64e5586b76f654ee2a34104f6c04f8a3569a518ec0987fc2544900e8a3f742a6e0d891a700d9a94482a0abdae64a1c106a4d4339963afd32391e0e660fabbc75c73200fc863287cfd54a7f22525775e4120556a2ebcbdab6cc332b14996c1e0a996810a0cd6a80cd044020b04a4466dee0e67b8bc2f21fe2e1eb7d093594c2601e679750aa8a9c4eb68a21575c34e4aa082');
})

it('ZelNode - sign message', function () {
  const msg = "050000000244bd2dbb77b7f0388d68a72e3845d079dd38b2c55f4bd682fe482e18750aae99000000002103c7f8f9e5368a2bee1ba3b3127b5039f84e8f1dad0e11f64e5586b76f654ee2a34104f6c04f8a3569a518ec0987fc2544900e8a3f742a6e0d891a700d9a94482a0abdae64a1c106a4d4339963afd32391e0e660fabbc75c73200fc863287cfd54a7f22525775e4120556a2ebcbdab6cc332b14996c1e0a996810a0cd6a80cd044020b04a4466dee0e67b8bc2f21fe2e1eb7d093594c2601e679750aa8a9c4eb68a21575c34e4aa082";
  const privateKey = 'L17FU2CoD4joDmEp1xMbfuD6eQ8Yr8SEC2gjbcKktLs3DS3WCCxF';
  const signature = zelcorejs.zelnode.signMessage(msg, privateKey);
  expect(signature).to.equal('Hwwod9fKqEGZr8W5m3keUOWgDW6jhlZlr4VsNq2DvSEXHYQCBSsceJ7/uNqw7nUlBd0bi4UjFS+gmVLX9Ipe7+A=');
})

it('ZelNode - sign Start message', function () {
  const msg = "050000000244bd2dbb77b7f0388d68a72e3845d079dd38b2c55f4bd682fe482e18750aae99000000002103c7f8f9e5368a2bee1ba3b3127b5039f84e8f1dad0e11f64e5586b76f654ee2a34104f6c04f8a3569a518ec0987fc2544900e8a3f742a6e0d891a700d9a94482a0abdae64a1c106a4d4339963afd32391e0e660fabbc75c73200fc863287cfd54a7f22525775e";
  const privateKey = 'L17FU2CoD4joDmEp1xMbfuD6eQ8Yr8SEC2gjbcKktLs3DS3WCCxF';
  const signature = zelcorejs.zelnode.signStartMessage(msg, privateKey);
  expect(signature).to.equal('20556a2ebcbdab6cc332b14996c1e0a996810a0cd6a80cd044020b04a4466dee0e67b8bc2f21fe2e1eb7d093594c2601e679750aa8a9c4eb68a21575c34e4aa082');
})

it('doubleHash', function () {
  const msg = "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d014dffffffff0100f2052a01000000434104e70a02f5af48a1989bf630d92523c9d14c45c75f7d1b998e962bff6ff9995fc5bdb44f1793b37495d80324acba7c8f537caaf8432b8d47987313060cc82d8a93ac00000000";
  const hash = zelcorejs.zelnode.doubleHash(msg);
  expect(hash).to.equal('660802c98f18fd34fd16d61c63cf447568370124ac5f3be626c2e1c3c9f0052d');
})

// start tx is not having signature
it('ZelNode - Create TXID from ZelNode start tx', function () {
  const msg = "0500000002b3ae41c6046000fd129425d08fd2142fc886cf2aea8d43a6951fc770e22cf914000000002103ffbec8caa95c594c574fa486b8540551dabdfa7aa86c3261b73bc96af32ab7a741047d88ba7d428352c09b402e84344dea5afb0ae8f7602893ab74804d1f7a7fb08e61857dac35012eb3b0c4ba603b38fd9575b92a53d1410fb5bdac38687998e35c2f00735e411f0d124251bb4751f573e80a66c84040cc3a5224ca3ba88a4a238f2cad85df98e47e42fe598b5c2dc07bff6d699cd67fc869a1a8e7da6b4fadbdd7287837602b85";
  const hash = zelcorejs.zelnode.txidStart(msg);
  expect(hash).to.equal('a89fcfa77810e5b6bae6a4be065d8db9f0aa7a11bedce37b9ddf91372fe0fa4e');
})

// Confirm tx is not having both signatures
it('Create transaction ID from ZelNode confirm tx', function () {
  const msg = "0500000004b3ae41c6046000fd129425d08fd2142fc886cf2aea8d43a6951fc770e22cf9140000000092e0915e0221dc915e010b3134342e39312e39372e37411c5c7481be62ae34064e2984eb541782bdbb7c35885cf5ac9c5faeef4e73be00a0528d8faa73a246271dd6846bb7d15c719ff83b8d2321e88feb26a6562e58ed55411bd1abef6bda91d48cbbae41e0aba2f7d8cd676e7b721ed05bd5535bffc82dc93d4038807f50a0f0bffb22c6e28acf684ea5b4974f38940290037af93f76c91142";
  const hash = zelcorejs.zelnode.txidConfirm(msg);
  expect(hash).to.equal('9c4dcbd1eab60e969207c90ed0e3ad8f6f8913372b255dc967a2cdbeeccebf3e');
})

// ============================================
// FluxNode v6 and Delegation Tests
// ============================================

// Test keys for delegation tests
// Collateral owner key
const OWNER_PRIVATE_KEY = 'L17FU2CoD4joDmEp1xMbfuD6eQ8Yr8SEC2gjbcKktLs3DS3WCCxF';
const OWNER_PUBLIC_KEY = '03c7f8f9e5368a2bee1ba3b3127b5039f84e8f1dad0e11f64e5586b76f654ee2a3';

// FluxNode key
const FLUXNODE_PRIVATE_KEY = '5JF3aGCa6bkPvfSzqtzX7fXFjfjUG4qzp9hdtRujLRE9ZAMfhiF';

// Delegate keys (generated deterministically from sequential seeds for testing)
const DELEGATE1_PRIVATE_KEY = 'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU74NMTptX4';
const DELEGATE2_PRIVATE_KEY = 'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU74sHUHy8S';
const DELEGATE3_PRIVATE_KEY = 'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU75NBY2dKG';
const DELEGATE4_PRIVATE_KEY = 'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU75s2EPgZf';

// Test collateral
const TEST_COLLATERAL_HASH = '99ae0a75182e48fe82d64b5fc5b238dd79d045382ea7688d38f0b777bb2dbd44';
const TEST_COLLATERAL_INDEX = 0;
const TEST_TIMESTAMP = 1584866597;

// Test: getPublicKeyFromPrivateKey helper
it('getPublicKeyFromPrivateKey - returns compressed public key', function () {
  const publicKey = zelcorejs.zelnode.getPublicKeyFromPrivateKey(OWNER_PRIVATE_KEY, true);
  expect(publicKey).to.equal(OWNER_PUBLIC_KEY);
  expect(publicKey.length).to.equal(66); // 33 bytes = 66 hex chars
})

// Test: getPublicKeyFromPrivateKey - uncompressed
it('getPublicKeyFromPrivateKey - returns uncompressed public key', function () {
  const publicKey = zelcorejs.zelnode.getPublicKeyFromPrivateKey(OWNER_PRIVATE_KEY, false);
  expect(publicKey.length).to.equal(130); // 65 bytes = 130 hex chars
})

// Test: Constants are exported correctly
it('Delegation constants are exported', function () {
  expect(zelcorejs.zelnode.DELEGATE_TYPE_NONE).to.equal(0);
  expect(zelcorejs.zelnode.DELEGATE_TYPE_UPDATE).to.equal(1);
  expect(zelcorejs.zelnode.DELEGATE_TYPE_SIGNING).to.equal(2);
  expect(zelcorejs.zelnode.MAX_DELEGATE_PUBKEYS).to.equal(4);
})

// Test: convertDelegatePrivateKeysToPublic
it('convertDelegatePrivateKeysToPublic - converts array of private keys to public keys', function () {
  const privateKeys = [DELEGATE1_PRIVATE_KEY, DELEGATE2_PRIVATE_KEY];
  const publicKeys = zelcorejs.zelnode.convertDelegatePrivateKeysToPublic(privateKeys);

  expect(publicKeys).to.be.an('array');
  expect(publicKeys.length).to.equal(2);
  // Each public key should be 66 hex chars (compressed)
  publicKeys.forEach(function(pk) {
    expect(pk.length).to.equal(66);
    expect(pk).to.match(/^[0-9a-f]+$/i);
  });
})

// Test: convertDelegatePrivateKeysToPublic - throws on invalid input
it('convertDelegatePrivateKeysToPublic - throws on non-array input', function () {
  expect(function() {
    zelcorejs.zelnode.convertDelegatePrivateKeysToPublic('not an array');
  }).to.throw('delegatePrivateKeys must be an array');
})

// Test: createDelegateData for UPDATE type
it('createDelegateData - creates UPDATE delegate data from public keys', function () {
  const publicKeys = zelcorejs.zelnode.convertDelegatePrivateKeysToPublic([DELEGATE1_PRIVATE_KEY]);
  const delegateData = zelcorejs.zelnode.createDelegateData(
    zelcorejs.zelnode.DELEGATE_TYPE_UPDATE,
    publicKeys
  );

  expect(delegateData.version).to.equal(1);
  expect(delegateData.type).to.equal(zelcorejs.zelnode.DELEGATE_TYPE_UPDATE);
  expect(delegateData.delegatePublicKeys).to.deep.equal(publicKeys);
})

// Test: createDelegateData for UPDATE type from private keys
it('createDelegateData - creates UPDATE delegate data from private keys', function () {
  const delegateData = zelcorejs.zelnode.createDelegateData(
    zelcorejs.zelnode.DELEGATE_TYPE_UPDATE,
    null,
    [DELEGATE1_PRIVATE_KEY]
  );

  expect(delegateData.version).to.equal(1);
  expect(delegateData.type).to.equal(zelcorejs.zelnode.DELEGATE_TYPE_UPDATE);
  expect(delegateData.delegatePublicKeys.length).to.equal(1);
  expect(delegateData.delegatePublicKeys[0].length).to.equal(66);
})

// Test: createDelegateData for SIGNING type
it('createDelegateData - creates SIGNING delegate data', function () {
  const delegateData = zelcorejs.zelnode.createDelegateData(
    zelcorejs.zelnode.DELEGATE_TYPE_SIGNING
  );

  expect(delegateData.version).to.equal(1);
  expect(delegateData.type).to.equal(zelcorejs.zelnode.DELEGATE_TYPE_SIGNING);
  expect(delegateData.delegatePublicKeys).to.be.undefined;
})

// Test: startFluxNodev6 basic (without delegates)
it('startFluxNodev6 - creates v6 transaction without delegates', function () {
  const tx = zelcorejs.zelnode.startFluxNodev6(
    TEST_COLLATERAL_HASH,
    TEST_COLLATERAL_INDEX,
    OWNER_PRIVATE_KEY,
    FLUXNODE_PRIVATE_KEY,
    TEST_TIMESTAMP
  );

  expect(tx).to.be.a('string');
  expect(tx.length).to.be.greaterThan(0);
  // v6 transactions start with version 6 (06000000 in little endian)
  expect(tx.substring(0, 8)).to.equal('06000000');
})

// Test: startFluxNodeAddDelegate with 1 delegate
it('startFluxNodeAddDelegate - creates transaction with 1 delegate', function () {
  const delegatePubKey = zelcorejs.zelnode.getPublicKeyFromPrivateKey(DELEGATE1_PRIVATE_KEY, true);

  const tx = zelcorejs.zelnode.startFluxNodeAddDelegate(
    TEST_COLLATERAL_HASH,
    TEST_COLLATERAL_INDEX,
    OWNER_PRIVATE_KEY,
    FLUXNODE_PRIVATE_KEY,
    TEST_TIMESTAMP,
    [delegatePubKey]
  );

  expect(tx).to.be.a('string');
  expect(tx.length).to.be.greaterThan(0);
  // v6 transactions start with version 6
  expect(tx.substring(0, 8)).to.equal('06000000');
  // Transaction should contain the delegate public key
  expect(tx).to.include(delegatePubKey);
})

// Test: startFluxNodeAddDelegate with 4 delegates (max)
it('startFluxNodeAddDelegate - creates transaction with 4 delegates (max)', function () {
  const delegatePubKeys = [
    zelcorejs.zelnode.getPublicKeyFromPrivateKey(DELEGATE1_PRIVATE_KEY, true),
    zelcorejs.zelnode.getPublicKeyFromPrivateKey(DELEGATE2_PRIVATE_KEY, true),
    zelcorejs.zelnode.getPublicKeyFromPrivateKey(DELEGATE3_PRIVATE_KEY, true),
    zelcorejs.zelnode.getPublicKeyFromPrivateKey(DELEGATE4_PRIVATE_KEY, true),
  ];

  const tx = zelcorejs.zelnode.startFluxNodeAddDelegate(
    TEST_COLLATERAL_HASH,
    TEST_COLLATERAL_INDEX,
    OWNER_PRIVATE_KEY,
    FLUXNODE_PRIVATE_KEY,
    TEST_TIMESTAMP,
    delegatePubKeys
  );

  expect(tx).to.be.a('string');
  // All delegate public keys should be in the transaction
  delegatePubKeys.forEach(function(pk) {
    expect(tx).to.include(pk);
  });
})

// Test: startFluxNodeAddDelegate - throws on too many delegates
it('startFluxNodeAddDelegate - throws when more than 4 delegates provided', function () {
  const delegatePubKeys = [
    zelcorejs.zelnode.getPublicKeyFromPrivateKey(DELEGATE1_PRIVATE_KEY, true),
    zelcorejs.zelnode.getPublicKeyFromPrivateKey(DELEGATE2_PRIVATE_KEY, true),
    zelcorejs.zelnode.getPublicKeyFromPrivateKey(DELEGATE3_PRIVATE_KEY, true),
    zelcorejs.zelnode.getPublicKeyFromPrivateKey(DELEGATE4_PRIVATE_KEY, true),
    zelcorejs.zelnode.getPublicKeyFromPrivateKey(OWNER_PRIVATE_KEY, true), // 5th delegate
  ];

  expect(function() {
    zelcorejs.zelnode.startFluxNodeAddDelegate(
      TEST_COLLATERAL_HASH,
      TEST_COLLATERAL_INDEX,
      OWNER_PRIVATE_KEY,
      FLUXNODE_PRIVATE_KEY,
      TEST_TIMESTAMP,
      delegatePubKeys
    );
  }).to.throw('Too many delegate public keys');
})

// Test: startFluxNodeAddDelegate - throws on empty delegates array
it('startFluxNodeAddDelegate - throws on empty delegates array', function () {
  expect(function() {
    zelcorejs.zelnode.startFluxNodeAddDelegate(
      TEST_COLLATERAL_HASH,
      TEST_COLLATERAL_INDEX,
      OWNER_PRIVATE_KEY,
      FLUXNODE_PRIVATE_KEY,
      TEST_TIMESTAMP,
      []
    );
  }).to.throw('At least one delegate public key must be provided');
})

// Test: startFluxNodeAddDelegate - throws on invalid public key format
it('startFluxNodeAddDelegate - throws on invalid public key format', function () {
  expect(function() {
    zelcorejs.zelnode.startFluxNodeAddDelegate(
      TEST_COLLATERAL_HASH,
      TEST_COLLATERAL_INDEX,
      OWNER_PRIVATE_KEY,
      FLUXNODE_PRIVATE_KEY,
      TEST_TIMESTAMP,
      ['invalidkey']
    );
  }).to.throw('Invalid delegate public key format');
})

// Test: startFluxNodeAsDelegate
it('startFluxNodeAsDelegate - creates transaction signed by delegate', function () {
  const tx = zelcorejs.zelnode.startFluxNodeAsDelegate(
    TEST_COLLATERAL_HASH,
    TEST_COLLATERAL_INDEX,
    DELEGATE1_PRIVATE_KEY,
    FLUXNODE_PRIVATE_KEY,
    TEST_TIMESTAMP
  );

  expect(tx).to.be.a('string');
  expect(tx.length).to.be.greaterThan(0);
  // v6 transactions start with version 6
  expect(tx.substring(0, 8)).to.equal('06000000');
})

// Test: Compare v5 and v6 transactions (v5 should be smaller without delegate data)
it('v5 transaction is smaller than v6 with delegates', function () {
  const v5tx = zelcorejs.zelnode.startZelNode(
    TEST_COLLATERAL_HASH,
    TEST_COLLATERAL_INDEX,
    OWNER_PRIVATE_KEY,
    FLUXNODE_PRIVATE_KEY,
    TEST_TIMESTAMP
  );

  const delegatePubKey = zelcorejs.zelnode.getPublicKeyFromPrivateKey(DELEGATE1_PRIVATE_KEY, true);
  const v6tx = zelcorejs.zelnode.startFluxNodeAddDelegate(
    TEST_COLLATERAL_HASH,
    TEST_COLLATERAL_INDEX,
    OWNER_PRIVATE_KEY,
    FLUXNODE_PRIVATE_KEY,
    TEST_TIMESTAMP,
    [delegatePubKey]
  );

  // v6 with delegates should be longer than v5
  expect(v6tx.length).to.be.greaterThan(v5tx.length);
})