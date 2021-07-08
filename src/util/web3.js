import Web3 from "web3";
import store from "../redux/store";
import type from "../redux/type";
import React from "react";
import {
  DBTOKEN_ABI,
  DOSTOKEN_ABI,
  STAKING_ABI,
  DEFAULT_NETWORK,
} from "../util/const";
import { connectorsMapping } from '../util/connector'
import { GetConstantByNetWork } from "../util/contract-helper";

export async function connectToClient() {
  console.log('connectToClient')
  let web3Instance = null;
  let isWalletInstalled = !!window.ethereum;
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
    API,
    USER_WALLET_NETWORK
  } = GetConstantByNetWork(networkVersion);
  let defaultConnector = connectorsMapping.Default
  let isAuthorized = await defaultConnector.isAuthorized()
  if (isAuthorized) {
    console.log('wallet authorized')
    let context = await defaultConnector.activate()
    console.log('wallet activated')
    context.account && dispatchWalletActivated(context.account, context)
  }
  let provider = PROVIDER
  if (isWalletInstalled && WALLET_NETWORK_SUPPORTED) {
    web3Instance = new Web3(window.ethereum);
  } else {
    if (provider.startsWith('ws')) {
      web3Instance = new Web3(new Web3.providers.WebsocketProvider(provider));
    } else if (provider.startsWith('http')) {
      web3Instance = new Web3(new Web3.providers.HttpProvider(provider));
    } else {
      console.log('@@@@@ No web3 provider detected');
      process.exit(1);
    }
  }
  let dosTokenContract = new web3Instance.eth.Contract(DOSTOKEN_ABI, DOSTOKEN_CONTRACT_ADDRESS);
  let dbTokenContract = new web3Instance.eth.Contract(DBTOKEN_ABI, DBTOKEN_CONTRACT_ADDRESS);
  let stakingContract = new web3Instance.eth.Contract(STAKING_ABI, STAKING_CONTRACT_ADDRESS);
  store.dispatch({
    type: type.CONTRACT_WEB3_CLINET_INIT,
    web3Client: web3Instance,
    dosTokenContract,
    dbTokenContract,
    stakingContract,
    network: CURRENT_NETWORK,
    connectedNetwork: USER_WALLET_NETWORK,
    networkSupported: WALLET_NETWORK_SUPPORTED,
    constant: {
      DBTOKEN_CONTRACT_ADDRESS,
      DOSTOKEN_CONTRACT_ADDRESS,
      STAKING_CONTRACT_ADDRESS
    },
    initialBlock: BLOCK_NUMBER,
    api: API,
  });
  return true
}

export function dispatchWalletActivated(accountAddress, web3Context) {
  store.dispatch({
    type: type.WALLET_ACTIVATE,
    address: accountAddress,
    web3Context: web3Context
  });
}

export function dispatchWalletDeactivated() {
  store.dispatch({
    type: type.WALLET_DEACTIVATE
  });
}
