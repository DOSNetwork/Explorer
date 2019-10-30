import Web3 from 'web3'
import store from '../redux/store'
import type from '../redux/type'
import React from 'react'
import { notification, Icon } from 'antd'

export function getWeb3() {
    let web3
    let state = store.getState()
    let userAddress = state.global.userAddress;
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
    } else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
    } else {
        alert('You have to install MetaMask !');
        return;
    }
    if (!userAddress) {
        // let allowAccess = !!window.ethereum.selectedAddress
        try {
            window.ethereum.enable().then(function (accountAddress) {
                store.dispatch({ type: type.METAMASK_ADDRESS_CHANGE, address: accountAddress[0] })
            });
            window.ethereum.on('accountsChanged', function (accounts) {
                store.dispatch({ type: type.METAMASK_ADDRESS_CHANGE, address: accounts[0] })
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

                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                } else {
                    notification.open({
                        message: 'MetaMask Account Change',
                        description:
                            <>
                                <h3>Lost Connection or Logged out!</h3>
                            </>,
                        icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                    })

                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    return web3
}
