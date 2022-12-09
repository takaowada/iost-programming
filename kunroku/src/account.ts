import IOST from '@kunroku/iost';

const DEFAULT_IOST_CONFIG = {
  gasPrice: 100,
  gasLimit: 100000,
  delay: 0,
  host: 'http://localhost:30001'
};

(async () => {
  const rpc = new IOST.API.RPC('http://localhost:30001', 300);

  const accountName = 'alice';
  const accountInfo = await rpc.blockchain.getAccountInfo(accountName, true);

  console.log(accountInfo);
  console.log(accountInfo.gas_info.pledged_info);
  console.log(accountInfo.permissions.active.items);
})();
