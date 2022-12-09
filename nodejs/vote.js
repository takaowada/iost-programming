import IOST from 'iost';

const rpc = new IOST.RPC(new IOST.HTTPProvider('http://api.iost.io'));

(async function () {
  const vote_producer_all = await rpc.blockchain.getContractStorageFields(
    'vote_producer.iost',
    'producerTable',
    true
  );
  console.log('vote_producer_all: ', vote_producer_all);

  const vote_producer = await rpc.blockchain.getContractStorage(
    'vote_producer.iost',
    'producerTable',
    'eversystem',
    true
  );
  console.log('vote_producer: ', vote_producer);

  const u_1_all = await rpc.blockchain.getContractStorageFields(
    'vote.iost',
    'u_1',
    true
  );
  console.log('u_1_all: ', u_1_all);
  console.log('u_1_all.fields: ', u_1_all.fields.length);

  const u_1 = await rpc.blockchain.getContractStorage(
    'vote.iost',
    'u_1',
    'eversystem',
    true
  );
  console.log('u_1: ', u_1);

  /*
  const v_1_all = await rpc.blockchain.getContractStorageFields(
    'vote.iost',
    'v_1',
    true
  );
  console.log('v_1: ', v_1);
  */
})();
