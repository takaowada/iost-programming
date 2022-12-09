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

	const account = new IOST.Account("admin");
  const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode('2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1'));
  account.addKeyPair('active', kp);
  account.addKeyPair('owner', kp);  

  iost.setPublisher(account);

  const id = "user3";
  const newKp = IOST.KeyPair.Ed25519.randomKeyPair();
  console.log(`Seckey: ${IOST.Bs58.encode(newKp.secretKey)}`);
  console.log(`Pubkey: ${IOST.Bs58.encode(newKp.publicKey)}`);
  const tx = iost.contract.auth.signUp(id, IOST.Bs58.encode(newKp.publicKey), IOST.Bs58.encode(newKp.publicKey));
  iost.contract.gas.pledge('admin', id, 1000, tx);
  iost.contract.ram.buy('admin', id, 1024 * 256, tx);
  iost.contract.token.transfer("iost", 'admin', id, 50000, "initial transfer", tx);
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
