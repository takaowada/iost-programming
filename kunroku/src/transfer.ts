import IOST from '@kunroku/iost';

const DEFAULT_IOST_CONFIG = {
  gasPrice: 100,
  gasLimit: 200000,
  delay: 0,
  host: 'http://localhost:30001'
};

(async () => {
  const iost = new IOST(DEFAULT_IOST_CONFIG);
  const rpc = new IOST.API.RPC('http://localhost:30001', 300);

  const account = new IOST.Account('alice');
  const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode('HPnQJ6haPGMA6eyjuAkWdEYdxtX9n7nwxvtPLVhMaoJBExvambgXNVLC4B2QjkH8PVKrEmK3v6jNmRokgaXRZQW'));
	//const account = new IOST.Account("hogehoge");
  //const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode('4MuWZCFqtUh8NiYDLGjjAaoD5CinE8dNwuvh1BqBwLSvbxRQ8NVRFkWYxgG991rVQLR28nxYZpz2Zu41cawkSSeC'));
  //const account = new IOST.Account('bobby');
  //const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode('5i6bXs8zNGAtsfqMkP6B9bSRKjyuDZLuGewM9NxmS8C1Y8vaWEE5oPiWZFKtMVmQ9qADVCS7L7xSKchtcnET711k'));
  //const account = new IOST.Account('user3');
  //const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode('4UHcD5KhhD6v2eMxmoUh6ehKcL6MqY1ZRrnVXbHAS4cJBUTvPCzKPxVBd3oyA13yoD4AMzzVVAoDtKDQxtvB8wQv'));
  account.addKeyPair('active', kp);
  account.addKeyPair('owner', kp);  

  iost.setPublisher(account);

  const tx = iost.createTx();
  //tx.chain_id = 1020;
	tx.addApprove('iost', "1");
  //tx.amount_limit = [{ token: "*", value: "unlimited" }];

  iost.call(
    'token.iost',
     'transfer',
    [
      "iost",
      "alice",
      "bobby",
      "1",
      'memo'
     ],
    tx
  );
  const handler = await iost.signAndSend(tx, true);
  handler.listen({
    interval: 1000,
    times: 60,
    irreversible: true
  });
  handler.onPending((res: any) => {
    console.log('pending: ', res);
  });
  handler.onSuccess((res: any) => {
    console.log('success: ', res);
  });
  handler.onFailed((res: any) => {
    console.log('failed: ', res);
  });
})();
