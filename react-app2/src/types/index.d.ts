interface Window {
  IWalletJS: {
    account: { name: string; network: string }
    enable: () => Promise<IOST.Account>
    IOST: IOST.IOST
    network: Network
    newIOST: (i: any) => IOST
    rpc: IOST.RPC
    setAccount: (param: { account: string; network: string }) => void
  }
}

type chrome = any

type Network = 'MAINNET' | 'TESTNET' | 'LOCALNET'

