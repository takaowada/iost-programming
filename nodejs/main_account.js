import IOST from 'iost';

const rpc = new IOST.RPC(new IOST.HTTPProvider('http://api.iost.io'));

(async function () {
  const accountInfo = await rpc.blockchain.getAccountInfo('eversystem', true);

  console.log(accountInfo);
})();
