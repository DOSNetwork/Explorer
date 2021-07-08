import {
    InjectedConnector
} from "@web3-react/injected-connector";
// import { NetworkConnector } from "@web3-react/network-connector";
import {
    WalletConnectConnector
} from "@web3-react/walletconnect-connector";
import {
    WalletLinkConnector
} from "@web3-react/walletlink-connector";
import {
    LedgerConnector
} from "@web3-react/ledger-connector";
import {
    TrezorConnector
} from "@web3-react/trezor-connector";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
    1: "https://mainnet.infura.io/v3/bd80ce1ca1f94da48e151bb6868bb150",
    4: "https://rinkeby.infura.io/v3/bd80ce1ca1f94da48e151bb6868bb150"
};

export const injected = new InjectedConnector({
    supportedChainIds: [1, 4, 56, 97, 128, 256]
});

// export const network = new NetworkConnector({
//   urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
//   defaultChainId: 1,
//   pollingInterval: POLLING_INTERVAL
// });

export const walletconnect = new WalletConnectConnector({
    rpc: {
        1: RPC_URLS[1]
    },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: POLLING_INTERVAL
});

export const walletlink = new WalletLinkConnector({
    url: RPC_URLS[1],
    appName: "Dashboard"
});

export const ledger = new LedgerConnector({
    chainId: 1,
    url: RPC_URLS[1],
    pollingInterval: POLLING_INTERVAL
});

export const trezor = new TrezorConnector({
    chainId: 1,
    url: RPC_URLS[1],
    pollingInterval: POLLING_INTERVAL,
    manifestEmail: "dummy@abc.xyz",
    manifestAppUrl: "https://8rg3h.csb.app/"
});

export const connectorsMapping = {
    Default: injected,
    MetaMask: injected,
    TrustWallet: injected,
    Trezor: trezor,
    Ledger: ledger,
}
