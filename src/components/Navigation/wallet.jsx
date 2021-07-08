import React from "react";
import {
    Web3ReactProvider
} from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import WalletConnector from './walletConnector';
import NetworkSwitch from './networkSwitch';

function Wallet() {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <NetworkSwitch />
            <WalletConnector />
        </Web3ReactProvider>
    )
}

function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
}
export default Wallet
