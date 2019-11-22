import Web3 from 'web3'
import store from '../redux/store'
import type from '../redux/type'
import React from 'react'
import { notification, Icon } from 'antd'

export function connectMetaMask() {
    let { web3Client } = store.getState().contract
    let web3 = web3Client || null

    if (!web3) {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            web3 = new Web3(web3.currentProvider);
        } else {
            alert('You have to install MetaMask !');
            return;
        }
    }
    store.dispatch({
        type: type.CONTRACT_WEB3_CLINET_INIT,
        web3Client: web3
    })
}


export function metaMaskLogin() {
    let { userAddress } = store.getState().contract
    if (!userAddress) {
        try {
            // let network = await web3.eth.net.getId()
            // let result
            // switch (network) {
            //     case 1:
            //         result = "mainnet";
            //         break
            //     case 2:
            //         result = "morden";
            //         break
            //     case 3:
            //         result = "ropsten";
            //         break
            //     case 4:
            //         result = "rinkeby";
            //         break
            //     default:
            //         result = "unknown network = " + network;
            // }
            // this.setState({ userContract: contractInstance, netWork: result })
            window.ethereum.enable()
                .then(function (accountAddress) {
                    store.dispatch({
                        type: type.CONTRACT_METAMASK_LOGIN,
                        address: accountAddress[0]
                    })
                });
            window.ethereum.on('accountsChanged', function (accounts) {

                let lastAccount = accounts[0]
                if (lastAccount) {
                    notification.open({
                        message: 'MetaMask Account Change',
                        description:
                            <>
                                <h3>Account change to</h3>
                                <p>{lastAccount}</p>
                            </>,
                        icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                    })
                    store.dispatch({ type: type.CONTRACT_USERADDRESS_CHANGE, address: accounts[0] })
                    // setTimeout(() => {
                    //     window.location.reload()
                    // }, 2000);
                } else {
                    notification.open({
                        message: 'MetaMask Account Change',
                        description:
                            <>
                                <h3>Lost Connection or Logged out!</h3>
                            </>,
                        icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                    })

                    store.dispatch({ type: type.CONTRACT_METAMASK_LOGOUT })
                }
            })
            window.ethereum.on('networkChanged', function (network) {

                let lastAccount = network
                notification.open({
                    message: 'MetaMask Account Change',
                    description:
                        <>
                            <h3>Account change to</h3>
                            <p>{lastAccount}</p>
                        </>,
                    icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                })
                // store.dispatch({ type: type.CONTRACT_USERADDRESS_CHANGE, address: accounts[0] })
            })
        } catch (e) {
            console.log(e)
        }
    }
}

export function metaMaskLogout() {
    let { userAddress } = store.getState().contract
    if (userAddress) {
        try {
            window.ethereum.enable()
                .then(function (accountAddress) {
                    store.dispatch({
                        type: type.CONTRACT_METAMASK_LOGOUT
                    })
                }).then(() => {
                    notification.open({
                        message: 'MetaMask Account',
                        description:
                            <>
                                <h3>Logged out!</h3>
                            </>,
                        icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                    })
                });
        } catch (e) {
            console.log(e)
        }
    }
}
