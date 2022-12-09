import IOST, { Transaction } from '@kunroku/iost';
import bs58 from 'bs58';
const IOST_NODE_URL = 'http://localhost:30001';

const DEFAULT_IOST_CONFIG = {
  gasPrice: 100,
  gasLimit: 100000,
  delay: 0,
  host: IOST_NODE_URL
};

const DELAY = 5000;

///////////////////////////////////////////////////////////////////////////
// Local
///////////////////////////////////////////////////////////////////////////
const LOCAL_CONTRACT = "Contract8HBMQEYnGYg3drvavSFGR73pcuh4iAAfwLDN9HjB9nk5";
const LOCAL_IP = "127.0.0.1";
// RPC address of IOST
const LOCAL_HOST = `http://${LOCAL_IP}:30001`;
// IOST chain ID
const LOCAL_CHAIN_ID = 1020;

///////////////////////////////////////////////////////////////////////////
// TESTNET
///////////////////////////////////////////////////////////////////////////
const STG_CONTRACT = "ContractHFs65266U5bRw4PWm8DUCXZ7LJFxrZcjE1J6wm87ts47";
const STG_IP = "testnet.iost.io";
// RPC address of IOST
const STG_HOST = `http://${STG_IP}:30001`;

// IOST chain ID
const TESTNET_CHAIN_IDainId = 1024;

const TIMEOUT = 60 * 5;

class BlockChainService {
  private static instance: BlockChainService;
  private _host: string;
  private _iost: IOST;
  private _publisher?: IOST.Account;
  private _rpc: IOST.API.RPC;
  private _contract: IOST.API.Contract;
  private _chainId = LOCAL_CHAIN_ID;

  private constructor() {
    this._host = LOCAL_HOST;
    this._iost = new IOST(DEFAULT_IOST_CONFIG);
    this._contract = new IOST.API.Contract(this._iost);
    this._rpc = new IOST.API.RPC(this._host, TIMEOUT);
  }
  static getInstance() {
    if (!BlockChainService.instance) {
      BlockChainService.instance = new BlockChainService();
    }
    return BlockChainService.instance;
  }

  getAccount(accountName: string, secKey: string) {
    const account = new IOST.Account(accountName);
    const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secKey));
    account.addKeyPair('active', kp);
    account.addKeyPair('owner', kp);
    return account;
  }

  getPublicKey(secKey: string) {
    const decoded = IOST.Bs58.decode(secKey);
    console.log("decoded", decoded);
    const kp = new IOST.KeyPair.Ed25519(decoded);
    console.log("kp.publicKey", kp.publicKey);
    const pubKey = IOST.Bs58.encode(kp.publicKey);
    return pubKey;
  }

  setPublisher(publisher: IOST.Account) {
    this._iost.setPublisher(publisher);
    this._publisher = publisher;
  }

  /**
   * Get account information.
   * 
   * @param {string} accountID
   * @returns Account information
   */
  async getAccountInfo(accountName: string) {
    //console.log('_iost', this._iost);
    const accountInfo = await this._rpc.blockchain.getAccountInfo(accountName, true);

    return accountInfo;
  }

  /**
   * Send token.
   * 
   * @param {string} contract 
   * @param {string} tokenSym 
   * @param {string} from 
   * @param {string} to 
   * @param {number} amount 
   * @param {string} memo 
   * @returns Transaction
   */
  async transfer(contract: string, tokenSym: string, from: string, to: string, amount: string | number, memo: string) {
    if (!this._publisher) {
      throw new Error('Publisher must be set before transfer.');
    }
    if (Number.isNaN(Number(amount))) {
      throw new Error('amount require number or string number')
    }
    const tx = this._iost.createTx();
    this._iost.call(
      contract,
      'transfer',
      [
        tokenSym,
        from,
        to,
        amount.toString(),
        memo
      ],
      tx
    );
    tx.addApprove(tokenSym, amount.toString());
    const res = await this.signAndSend(tx);
    return res;
  }

  async signAndSend(tx: Transaction.Tx) {
    if (!this._publisher) {
      throw new Error('Publisher must be set before transfer.');
    }
    console.log(
      'signAndSend:',
      'name:',
      this.signAndSend.name,
      'action:',
      JSON.stringify({ actions: tx.actions }),
    );
    this._iost.setPublisher(this._publisher!);

    return new Promise<string>((resolve, reject) => {
      const handler = new IOST.Transaction.Handler(tx, this._rpc, true);
      handler.onPending((res) => {
        console.log('TransactionHandler', `pending: ${res.hash}`);
      });
      handler.onSuccess((res) => {
        console.log(
          'TransactionHandler',
          `success: ${JSON.stringify(res)}`,
        );
        resolve(res.tx_hash);
      });
      handler.onFailed((res) => {
        console.log('TransactionHandler');
        console.log(res);
        reject(res.message);
      });
      handler.signAndSend(this._publisher!, []);
      //const handler = this._iost.signAndSend(tx, false);
      handler.listen({
        interval: 500,
        times: 50,
        irreversible: true
      });
    });
  }
}

export default BlockChainService;
