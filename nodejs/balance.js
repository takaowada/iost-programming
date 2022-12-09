import IOST from 'iost';
import bs58 from 'bs58';

// IOSTオブジェクトを作成する。
const iost = new IOST.IOST({
  gasRatio: 1,
  gasLimit: 2000000,
  delay: 0,
  expiration: 90,
});

// RPCオブジェクトを作成する。
const rpc = new IOST.RPC(new IOST.HTTPProvider('http://localhost:30001'));
// IOSTオブジェクトにRPCオブジェクトをセットする。
iost.setRPC(rpc);

// アカウントオブジェクトを作成する。
const account = new IOST.Account('alice');
// 既存の秘密鍵から、キーペアオブジェクトを作成する。
const kp = new IOST.KeyPair(
  bs58.decode(
    'HPnQJ6haPGMA6eyjuAkWdEYdxtX9n7nwxvtPLVhMaoJBExvambgXNVLC4B2QjkH8PVKrEmK3v6jNmRokgaXRZQW'
  )
);

// アカウントオブジェクトにキーペアオブジェクトをセットする。
account.addKeyPair(kp, 'active');
// owner権限が必要ならセットする。
//account.addKeyPair(kp, 'owner');

// IOSTオブジェクトに実行アカウントをセットする。
iost.setAccount(account);

// トランザクションを作成する。
const tx = iost.callABI('token.iost', 'balanceOf', ['iost', 'alice']);
// チェーンIDをセットする。
tx.setChainID(1020);

// トランザクションに署名し、送信する。
iost
  .signAndSend(tx)
  .on('pending', (response) => {
    // 受付時の処理
    console.log(response);
  })
  .on('success', (response) => {
    // 成功時の処理
    console.log(response);
  })
  .on('failed', (response) => {
    // 失敗時の処理
    console.log(response);
  });
