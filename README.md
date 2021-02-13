# zelcorejs
Dead simple and easy to use JavaScript library for ZelCore purposes. Based on [zencashjs](https://github.com/ZencashOfficial/zencashjs)

# Getting started (Dev)
```bash
git clone https://github.com/zelcash/zelcorejs.git
cd zeltrzejs
npm install
```

# Example usage - more in tests
```javascript
var zelcorejs = require('zelcorejs')

var priv = zelcorejs.address.mkPrivKey('chris p. bacon, defender of the guardians')
// 2c3a48576fe6e8a466e78cd2957c9dc62128135540bbea0685d7c4a23ea35a6c

var wif = '80'

var privWIF = zelcorejs.address.privKeyToWIF(priv, true, wif)
// 5J9mKPd531Tk4A73kKp4iowoi6EvhEp8QSMAVzrZhuzZkdpYbK8

var pubKey = zelcorejs.address.privKeyToPubKey(priv, true)
// 048a789e0910b6aa314f63d2cc666bd44fa4b71d7397cb5466902dc594c1a0a0d2e4d234528ff87b83f971ab2b12cd2939ff33c7846716827a5b0e8233049d8aad

var pubKeyHash = '1cb8'

var tAddr = zelcorejs.address.pubKeyToAddr(pubKey, pubKeyHash)
// t1aYp69J595Rhaof2AEFuEvJjLWVboddB2x
```
