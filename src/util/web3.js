import Web3 from "web3";
import store from "../redux/store";
import type from "../redux/type";
import React from "react";
import { Button, notification, Icon, Modal } from "antd";
import {
    DB_ABI,
    DOSTOKEN_ABI,
    DOS_ABI,
    DEFAULT_NETWORK,
    approveString
} from "../util/const";
import {
    GetConstantByNetWork
} from '../util/contract-helper'

export function connectToEthereum() {
    let web3 = null;
    let isWalletInstalled = !!window.ethereum
    // 如果没有安装钱包.使用默认
    let networkVersion = isWalletInstalled && window.ethereum.networkVersion ? window.ethereum.networkVersion : DEFAULT_NETWORK
    const {
        DB_CONTRACT_ADDRESS,
        DOSTOKEN_CONTRACT_ADDRESS,
        DOS_CONTRACT_ADDRESS,
        CURRENT_NETWORK,
        WALLET_NETWORK_SUPPORTED,
        BLOCK_NUMBER,
        PROVIDER,
        USER_WALLET_NETWORK
    } = GetConstantByNetWork(networkVersion)
    if (isWalletInstalled && WALLET_NETWORK_SUPPORTED) {
        web3 = new Web3(window.ethereum);
    } else {
        web3 = new Web3(new Web3.providers.WebsocketProvider(PROVIDER));
    }

    let dosTokenContract = new web3.eth.Contract(
        DOSTOKEN_ABI,
        DOSTOKEN_CONTRACT_ADDRESS
    );
    let dbTokenContract = new web3.eth.Contract(
        DB_ABI,
        DB_CONTRACT_ADDRESS
    );
    let dosContract = new web3.eth.Contract(
        DOS_ABI,
        DOS_CONTRACT_ADDRESS
    );

    if (!WALLET_NETWORK_SUPPORTED) {
        Modal.warning({
            title: 'Incorrect Network',
            content: `We only support ${CURRENT_NETWORK}, but you're currently connected to ${USER_WALLET_NETWORK}.`,
        });
    }
    store.dispatch({
        type: type.CONTRACT_WEB3_CLINET_INIT,
        web3Client: web3,
        dosTokenContract,
        dbTokenContract,
        dosContract,
        network: CURRENT_NETWORK,
        networkSupported: WALLET_NETWORK_SUPPORTED,
        constant: {
            DB_CONTRACT_ADDRESS,
            DOSTOKEN_CONTRACT_ADDRESS,
            DOS_CONTRACT_ADDRESS
        },
        initialBlock: BLOCK_NUMBER
    });
}


async function approve(accountAddress) {
    let { dosTokenContract, dbTokenContract, constant } = store.getState().contract;
    let { DOS_CONTRACT_ADDRESS } = constant
    let address = accountAddress[0];
    store.dispatch({
        type: type.CONTRACT_METAMASK_LOGIN,
        address: address
    });
    const result = await dosTokenContract.methods
        .allowance(address, DOS_CONTRACT_ADDRESS)
        .call();
    const dbResult = await dbTokenContract.methods
        .allowance(address, DOS_CONTRACT_ADDRESS)
        .call();
    if (
        result.toString() !== approveString ||
        dbResult.toString() !== approveString
    ) {
        const key = `open${Date.now()}`;
        const btn = (
            <>
                <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                        if (result.toString() !== approveString) {
                            dosTokenContract.methods
                                .approve(DOS_CONTRACT_ADDRESS)
                                .send({ from: address })
                                .then(result => {
                                    // console.log(`approve:${result}`);
                                })
                                .catch(err => {
                                    // console.log(err);
                                });
                        }
                        if (dbResult.toString() !== approveString) {
                            dbTokenContract.methods
                                .approve(DOS_CONTRACT_ADDRESS)
                                .send({ from: address })
                                .then(result => {
                                    // console.log(`approve:${result}`);
                                })
                                .catch(err => {
                                    // console.log(err);
                                });
                        }
                        notification.close(key);
                    }}
                >
                    Confirm
        </Button>
                &nbsp;
                <Button
                    type="primary"
                    size="small"
                    onClick={() => notification.close(key)}
                >
                    Cancel
        </Button>
            </>
        );
        notification.open({
            message: "Permission requests",
            description:
                "Approve the DOS token and DropBurn token on the DOS staking contract",
            btn,
            key
        });
    }
}
export function walletLogin() {
    return new Promise((resolve, reject) => {
        try {
            if (window.ethereum) {
                window.ethereum.enable().then(approve);
                window.ethereum.on("accountsChanged", function (accounts) {
                    let lastAccount = accounts[0];
                    if (lastAccount) {
                        store.dispatch({
                            type: type.CONTRACT_USERADDRESS_CHANGE,
                            address: accounts[0]
                        });
                    } else {
                        store.dispatch({ type: type.CONTRACT_METAMASK_LOGOUT });
                    }
                });
                window.ethereum.on("networkChanged", function (network) {
                    let lastAccount = network;
                    notification.open({
                        message: "MetaMask Account Change",
                        description: (
                            <>
                                <h3>Account change to</h3>
                                <p>{lastAccount}</p>
                            </>
                        ),
                        icon: <Icon type="smile" style={{ color: "#108ee9" }} />
                    });
                });
                resolve(true)
            }
            else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })

}
export function walletLogout() {
    let { userAddress } = store.getState().contract;
    if (userAddress) {
        try {
            window.ethereum
                .enable()
                .then(function (accountAddress) {
                    store.dispatch({
                        type: type.CONTRACT_METAMASK_LOGOUT
                    });
                })
        } catch (e) {
            // console.log(e);
        }
    }
}
