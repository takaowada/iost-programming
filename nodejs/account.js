import IOST from 'iost';

const rpc = new IOST.RPC(new IOST.HTTPProvider('http://localhost:30001'));

(async function () {
  const accountInfo = await rpc.blockchain.getAccountInfo('alice', true);

  console.log(accountInfo);
})();
