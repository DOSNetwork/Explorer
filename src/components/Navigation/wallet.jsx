import React from "react";
import {
    Web3ReactProvider
} from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import {
    WalletIcon
} from '../SvgIcon/icons.jsx'
import WalletConnector from './walletConnector'
function Wallet() {
    return (
        <div className="wallet__status__panel" >
            <WalletIcon />
            <Web3ReactProvider getLibrary={getLibrary}>
                <WalletConnector />
            </Web3ReactProvider>
        </div>
    )
}

function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
}
export default Wallet
