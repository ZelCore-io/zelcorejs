const chai = require('chai')
const expect = chai.expect
const transaction_1 = require("../lib/veriblock/txs");
const crypto_1 = require("../lib/veriblock/crypto");
const PRIVATE_KEY = Buffer.from('303E020100301006072A8648CE3D020106052B8104000A04273025020101042017869E398A7ACD18729B8FC6D47DCFE9C1A2B5871334D00471EFC3985762FF8F', 'hex');
const kp = crypto_1.KeyPair.fromPrivateKey(PRIVATE_KEY);
it('create transaction', () => {
    // 1. create an unsigned transaction as JS object
    // fee in this case is 100701000-100000000=701000
    // 1 VBK = 1000_000_000 units
    const tx = {
        sourceAddress: 'V4vxZyZ5oR32Vdmj3SFk4SdJ36NRGX',
        sourceAmount: '100701000',
        outputs: [
            {
                address: 'VAE91zJuku3oiMa7tqZKwo2YQ2UvcD',
                amount: '100000000',
            },
        ],
    };
    // 2. get your signatureIndex with getsignatureindex query
    const signatureIndex = 0;
    // 3. deserialize it to model object
    const obj = transaction_1.tryDeserializeTransaction(tx);
    //console.log(tx);
    // console.log(obj);
    // 4. sign it
    const signedTxModel = transaction_1.signTransaction(obj, kp, signatureIndex);
    // 5. serialize to JS object
    const signedTxObj = transaction_1.trySerializeSignedTransaction(signedTxModel);
    // console.log(signedTxObj)
    // expect(signedTxObj.publicKey).toBeDefined();
    // expect(signedTxObj.signature).toBeDefined();
    // expect(signedTxObj.transaction).toBeDefined();
    // expect(signedTxObj.signatureIndex).toBeDefined();
    expect(signedTxObj.signatureIndex).to.equal(signatureIndex);
    expect(signedTxObj.transaction.sourceAddress).to.equal('V4vxZyZ5oR32Vdmj3SFk4SdJ36NRGX');
    expect(signedTxObj.transaction.sourceAmount).to.equal('100701000');
    // expect(signedTxObj.transaction.outputs).toHaveLength(1);
    expect(signedTxObj.transaction.outputs[0].address).to.equal('VAE91zJuku3oiMa7tqZKwo2YQ2UvcD');
    expect(signedTxObj.transaction.outputs[0].amount).to.equal('100000000');
    // added fields after signTransaction
    expect(signedTxObj.transaction.transactionFee).to.equal('701000');
    expect(signedTxObj.transaction.data).to.equal('');
    expect(signedTxObj.transaction.type).to.equal(1);
    // console.log(signedTxObj.transaction)
    expect(signedTxObj.transaction.txId).to.equal(transaction_1.getTransactionId(obj, signatureIndex).toString('hex'));
});
it('serialize/deserialize valid transaction', () => {
    const validTx = {
        signature: '3045022100bc6508c47500e3cf5e01d4f0c2709602d479d45d486bf244a499df05dbdb233802204de76c6f126b2ef8343dd18b21551a70497c0c50eed81bfca605c3240a5469f5',
        publicKey: '3056301006072a8648ce3d020106052b8104000a034200048569053d7b483059100b4c914cce0b39ed3d4b8c70419e9a4f3102a6f9ad62606e6c5085767f4fc83dad5cc5c35e70ce7198b8db0e863ac19e4c20b37a503a5e',
        signatureIndex: 13,
        transaction: {
            transactionFee: '701000',
            data: '',
            type: 1,
            sourceAddress: 'V4vxZyZ5oR32Vdmj3SFk4SdJ36NRGX',
            sourceAmount: '100701000',
            txId: 'ffc717462162ebc5e8730cc82b225f998c878be9fc47eb251ccc948cf2d2d296',
            outputs: [
                {
                    address: 'VAE91zJuku3oiMa7tqZKwo2YQ2UvcD',
                    amount: '100000000',
                },
            ],
            networkByte: undefined
        },
    };
    const deserialized = transaction_1.tryDeserializeSignedTransaction(validTx);
    const serialized = transaction_1.trySerializeSignedTransaction(deserialized);
    expect(serialized.signature).to.equal(validTx.signature);
    expect(serialized.publicKey).to.equal(validTx.publicKey);
    expect(serialized.transaction.txId).to.equal(validTx.transaction.txId);
});
//# sourceMappingURL=transaction.spec.js.map