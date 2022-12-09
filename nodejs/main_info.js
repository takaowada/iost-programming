import IOST from 'iost';

const rpc = new IOST.RPC(new IOST.HTTPProvider('http://api.iost.io'));

(async function () {
  const chainInfo = await rpc.blockchain.getChainInfo();
  console.log('GetChainInfo result: ', chainInfo);

  const nodeInfo = await rpc.net.getNodeInfo();
  console.log('GetNodeInfo result: ', nodeInfo);
})();
