import IOST from '@kunroku/iost';

const DEFAULT_IOST_CONFIG = {
  gasPrice: 100,
  gasLimit: 100000,
  delay: 0,
  host: 'http://localhost:30001'
};

(async () => {
  const iost = new IOST(DEFAULT_IOST_CONFIG);
  const rpc = new IOST.API.RPC('http://localhost:30001', 300);

	const account = new IOST.Account("admin");
  const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode('2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1'));
  account.addKeyPair('active', kp);
  account.addKeyPair('owner', kp);  

  iost.setPublisher(account);

  const tx = iost.contract.ram.buy("admin", "alice", 1024 * 256);
  const handler = await iost.signAndSend(tx, true);
  handler.listen({
    interval: 1000,
    times: 60
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
