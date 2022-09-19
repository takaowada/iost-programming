import Iost from "iost";
const CONTRACT_ADDRESS = 'Contract3DdY8afj9YG1JxbzpiAmdq2XAHc4GwjA1eA9ExedMjwj';
const IOST_NODE_URL = 'http://localhost:30001'

export default class IOSUtil {
  private static instance: IOSUtil;
  private iost?: IOST.IOST;
  private account?: IOST.Account;

  private constructor() {  
  }  

  static getInstance() {
    console.log('getInstance')
    if (!IOSUtil.instance) {
      IOSUtil.instance = new IOSUtil();
      console.log('New IOST')
    }
    return IOSUtil.instance;
  }

  async init() {
    console.log("window", window);

    const iwallet = window["IWalletJS"];
    console.log("iwallet", iwallet);
    if (iwallet) {
      console.log("## Start to login");
      try {
        this.account = await iwallet.enable();
        console.log("account", this.account);
      } catch (e) {
        throw new Error('The iWallet locked. Before do it, unlock iWallet. ');
      }
      if (!this.account) {
        throw new Error('Please login before do sth with iWallet');
      }
  
      this.iost = iwallet.newIOST(Iost)
      console.log("iost", this.iost);
      if (!this.iost) {
        throw new Error('Please login before do sth with iWallet');
      }

      const provider = new IOST.HTTPProvider(IOST_NODE_URL);
      const rpc = new IOST.RPC(provider);
      this.iost.rpc = rpc;
      this.iost.config.gasLimit = 2000000;
    }
  }

  /**
   * ストレージからキーだけ指定で読み出し
   * @returns 
   */
   async getNumber1() {
    console.log(this.iost);
    if (!this.iost || !this.iost.rpc) {
      throw new Error("IOST object not found.");
    }
    const { data: _number1 } = 
      await this.iost.rpc!.blockchain.getContractStorage(
        "ContractDvbrQ2dmQCRE6q1CwQKkqtmDMmS2s9BZYnnwFvL5sEpc",
        "number1",
        "",
      );
    console.log(`_number1: ${_number1}`)
    const number1 = Number(_number1);
    if (Number.isNaN(number1)) {
      throw new Error("Invalid data");
    }
    return number1;
  }
  
  
  async getNumber2(field: string) {
    if (!this.iost || !this.iost.rpc) {
      throw new Error("IOST object not found.");
    }
    //const iost = createIOST();
    const { data: _number2 } =
      await this.iost.rpc.blockchain.getContractStorage(
        CONTRACT_ADDRESS,
        "NUM2",
        field,
      );
    const number2 = Number(_number2);
    if (Number.isNaN(number2)) {
      throw new Error("Invalid data");
    }
    return number2;
  }
}
