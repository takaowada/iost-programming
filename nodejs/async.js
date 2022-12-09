import IOST from 'iost';
import bs58 from 'bs58';

(async function () {
  // init iost sdk
  const iost = new IOST.IOST({
    // will use default setting if not set
    gasRatio: 1,
    gasLimit: 2000000,
    delay: 0,
    expiration: 90,
  });
  const rpc = new IOST.RPC(new IOST.HTTPProvider('http://localhost:30001'));

  await iost.setRPC(rpc);

  // init admin account
  const account = new IOST.Account('alice');
  const kp = new IOST.KeyPair(
    bs58.decode(
      'HPnQJ6haPGMA6eyjuAkWdEYdxtX9n7nwxvtPLVhMaoJBExvambgXNVLC4B2QjkH8PVKrEmK3v6jNmRokgaXRZQW'
    )
  );
  //const account = new IOST.Account("hogehoge");
  //const kp = new IOST.KeyPair(bs58.decode('4MuWZCFqtUh8NiYDLGjjAaoD5CinE8dNwuvh1BqBwLSvbxRQ8NVRFkWYxgG991rVQLR28nxYZpz2Zu41cawkSSeC'));
  account.addKeyPair(kp, 'owner');
  account.addKeyPair(kp, 'active');

  //const tx = iost.callABI("token.iost", "transfer", ["iost", "alice", "bobby", "1", "memojs"]);
  const tx = iost.callABI('token.iost', 'balanceOf', ['iost', 'alice']);
  tx.addApprove('iost', 1);
  tx.setChainID(1020);
  tx.amount_limit = [{token: '*', value: 'unlimited'}];

  iost.setAccount(account);
  iost
    .signAndSend(tx)
    .on('pending', (response) => {
      console.log('pending: ', response);
    })
    .on('success', (response) => {
      console.log('success: ', response);
    })
    .on('failed', (response) => {
      console.log(response);
    });
})();
