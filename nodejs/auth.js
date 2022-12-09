import IOST from 'iost';

const rpc = new IOST.RPC(new IOST.HTTPProvider('http://api.iost.io'));

(async function () {
  const auth_all = await rpc.blockchain.getContractStorageFields(
    'auth.iost',
    'auth',
    true
  );
  console.log('auth_all: ', auth_all);

  const auth = await rpc.blockchain.getContractStorage(
    'auth.iost',
    'auth',
    'eversystem',
    true
  );
  console.log('auth: ', auth);
})();
