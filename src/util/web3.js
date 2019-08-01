import Web3 from 'web3'
import { addressChange } from '../redux/action'
import store from '../redux/store'
import type from '../redux/type'
import React from 'react'
import { notification, Icon } from 'antd'
let web3
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    let allowAccess = !!window.ethereum.selectedAddress
    try {
        window.ethereum.enable().then(function (accountAddress) {
            if (!allowAccess) {
                addressChange(accountAddress)
            }
        });
        window.ethereum.on('accountsChanged', function (accounts) {
            store.dispatch({ type: type.METAMASK_ADDRESS_CHANGE, address: accounts[0] })
            notification.open({
                message: 'MetaMask Account Change',
                description:
                    <>
                        <h3>Account change to</h3>
                        <p>{accounts[0]}</p>
                    </>,
                icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
            })
        })
    } catch (e) {
        console.log(e)
    }
} else if (window.web3) {
    web3 = new Web3(web3.currentProvider);
} else {
   // alert('You have to install MetaMask !');
}
export default web3;
