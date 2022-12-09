import BlockChainService from "./BlockChainService.js";

(async () => {
  const blockchainService = BlockChainService.getInstance();
  /*
  let accountInfo = await blockchainService.getAccountInfo('alice');
  console.log('### alice:', accountInfo);
  accountInfo = await blockchainService.getAccountInfo('bobby');
  console.log('### bobby:', accountInfo);
  accountInfo = await blockchainServic('hogehoge');
  console.log('### bobby:', accountInfo);
  */
  const pubkey = await blockchainService.getPublicKey('2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1');
  console.log('### pubkey:', pubkey);

})();
