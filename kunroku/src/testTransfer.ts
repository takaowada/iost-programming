import BlockChainService from "./BlockChainService.js";

(async () => {
  const blockchainService = BlockChainService.getInstance();
  const activeAccount = blockchainService.getAccount('alice', 'HPnQJ6haPGMA6eyjuAkWdEYdxtX9n7nwxvtPLVhMaoJBExvambgXNVLC4B2QjkH8PVKrEmK3v6jNmRokgaXRZQW');

  let accountInfo = await blockchainService.getAccountInfo('alice');
  console.log('#before balance of alice:', accountInfo.balance);
  accountInfo = await blockchainService.getAccountInfo('bobby');
  console.log('#before balance of bobby:', accountInfo.balance);

  blockchainService.setPublisher(activeAccount);
  const result = await blockchainService.transfer(
    'token.iost',
    'iost',
    'alice',
    'xxxxx',
    1,
    'memo'
  );
  console.log('result');
  console.log(result);

  accountInfo = await blockchainService.getAccountInfo('alice');
  console.log('#after balance of alice:', accountInfo.balance);
  accountInfo = await blockchainService.getAccountInfo('bobby');
  console.log('#after balance of bobby:', accountInfo.balance);
})();
