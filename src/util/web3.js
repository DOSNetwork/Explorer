import Web3 from 'web3'
import { addressChange } from '../redux/action'
import store from '../redux/store'
import type from '../redux/type'

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
        })

    } catch (e) {
        console.log(e)
    }
} else if (window.web3) {
    web3 = new Web3(web3.currentProvider);
} else {
    alert('You have to install MetaMask !');
}
export default web3;
