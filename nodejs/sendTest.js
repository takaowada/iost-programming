import IOST from 'iost';
import bs58 from 'bs58';

// init iost sdk
const iost = new IOST.IOST({ // will use default setting if not set
    gasRatio: 1,
    gasLimit: 2000000,
    delay:0,
    expiration: 90,
});
const rpc = new IOST.RPC(new IOST.HTTPProvider('http://localhost:30001'));
iost.setRPC(rpc);

// init admin account

const account = new IOST.Account("alice");
const kp = new IOST.KeyPair(bs58.decode('bXaTWoyBsGX5bvhVeYbw8BXVy9PmVNLtxCYsFUDqqcMXTLQRDwR3o2RceX1w5T2L4gNSjuEGBRV8Nwq8qyqge6t'));
account.addKeyPair(kp, "owner");
account.addKeyPair(kp, "active");

iost.setAccount(account);

const tx = iost.callABI("token.iost", "transfer", ["iost", "alice", "bobby", "1", "memo"]);
tx.setChainID(1020);

iost.signAndSend(tx)
	.on('pending', (response) => {
		console.log('pending', response);
	})
	.on('success', (response) => {
		console.log('success', response);
	})
	.on('failed', (response) => {
		console.log('failed', response);
	})