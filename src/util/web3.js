import Web3 from "web3";
import store from "../redux/store";
import type from "../redux/type";
import React from "react";
import { Button, notification, Icon, Modal } from "antd";
import {
  DBTOKEN_ABI,
  DOSTOKEN_ABI,
  STAKING_ABI,
  DEFAULT_NETWORK,
  approveString
} from "../util/const";
import { GetConstantByNetWork } from "../util/contract-helper";

export function connectToEthereum() {
  let web3 = null;
  let isWalletInstalled = !!window.ethereum;
  // 如果没有安装钱包.使用默认
  let networkVersion =
    isWalletInstalled && window.ethereum.networkVersion
      ? window.ethereum.networkVersion
      : DEFAULT_NETWORK;
  const {
    DBTOKEN_CONTRACT_ADDRESS,
    DOSTOKEN_CONTRACT_ADDRESS,
    STAKING_CONTRACT_ADDRESS,
    CURRENT_NETWORK,
    WALLET_NETWORK_SUPPORTED,
    BLOCK_NUMBER,
    PROVIDER,
    USER_WALLET_NETWORK
  } = GetConstantByNetWork(networkVersion);
  if (isWalletInstalled && WALLET_NETWORK_SUPPORTED) {
    web3 = new Web3(window.ethereum);
  } else {
    web3 = new Web3(new Web3.providers.WebsocketProvider(PROVIDER));
  }

  let dosTokenContract = new web3.eth.Contract(
    DOSTOKEN_ABI,
    DOSTOKEN_CONTRACT_ADDRESS
  );
  let dbTokenContract = new web3.eth.Contract(DBTOKEN_ABI, DBTOKEN_CONTRACT_ADDRESS);
  let stakingContract = new web3.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);

  if (!WALLET_NETWORK_SUPPORTED) {
    Modal.warning({
      title: "Incorrect Network",
      content: `We only support ${CURRENT_NETWORK}, but you're currently connected to ${USER_WALLET_NETWORK}.`
    });
  }
  store.dispatch({
    type: type.CONTRACT_WEB3_CLINET_INIT,
    web3Client: web3,
    dosTokenContract,
    dbTokenContract,
    stakingContract,
    network: CURRENT_NETWORK,
    networkSupported: WALLET_NETWORK_SUPPORTED,
    constant: {
      DBTOKEN_CONTRACT_ADDRESS,
      DOSTOKEN_CONTRACT_ADDRESS,
      STAKING_CONTRACT_ADDRESS
    },
    initialBlock: BLOCK_NUMBER
  });
}

async function approve(accountAddress) {
  let {
    dosTokenContract,
    dbTokenContract,
    constant
  } = store.getState().contract;
  let { STAKING_CONTRACT_ADDRESS } = constant;
  let address = accountAddress[0];
  store.dispatch({
    type: type.CONTRACT_METAMASK_LOGIN,
    address: address
  });
}
export function walletLogin() {
  return new Promise((resolve, reject) => {
    try {
      if (window.ethereum) {
        window.ethereum.enable().then(approve);
        window.ethereum.on("accountsChanged", function(accounts) {
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
        window.ethereum.on("networkChanged", function(network) {
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
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
}
export function walletLogout() {
  let { userAddress } = store.getState().contract;
  if (userAddress) {
    try {
      window.ethereum.enable().then(function(accountAddress) {
        store.dispatch({
          type: type.CONTRACT_METAMASK_LOGOUT
        });
      });
    } catch (e) {
      // console.log(e);
    }
  }
}
