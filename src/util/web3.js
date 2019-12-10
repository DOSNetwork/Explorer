import Web3 from "web3";
import store from "../redux/store";
import type from "../redux/type";
import React from "react";
import { Button, notification, Icon } from "antd";
import {
  DOSTOKEN_ABI,
  DOSTOKEN_CONTRACT_ADDRESS,
  DB_ABI,
  DB_CONTRACT_ADDRESS,
  DOS_CONTRACT_ADDRESS
} from "../util/const";
export var USERADDRESS = "";
const approveString =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";
export function connectMetaMask() {
  let { web3Client } = store.getState().contract;
  let web3 = web3Client || null;

  if (!web3) {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      web3 = new Web3(web3.currentProvider);
    } else {
      let web3Provider = new Web3.providers.WebsocketProvider(
        "wss://rinkeby.infura.io/ws/v3/3a3e5d776961418e93a8b33fef2f6642"
      );
      web3 = new Web3(web3Provider);
    }
  }
  store.dispatch({
    type: type.CONTRACT_WEB3_CLINET_INIT,
    web3Client: web3
  });
  return web3;
}

async function approve(accountAddress) {
  let { userAddress, web3Client } = store.getState().contract;
  let address = accountAddress[0];
  USERADDRESS = address;
  store.dispatch({
    type: type.CONTRACT_METAMASK_LOGIN,
    address: address
  });
  // approve
  let dosTokenContract = new web3Client.eth.Contract(
    DOSTOKEN_ABI,
    DOSTOKEN_CONTRACT_ADDRESS
  );
  let dbTokenContract = new web3Client.eth.Contract(
    DB_ABI,
    DB_CONTRACT_ADDRESS
  );
  const result = await dosTokenContract.methods
    .allowance(address, DOS_CONTRACT_ADDRESS)
    .call();
  const dbResult = await dosTokenContract.methods
    .allowance(address, DOS_CONTRACT_ADDRESS)
    .call();
  console.log(`allowance:${result}`);
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
                  console.log(`approve:${result}`);
                })
                .catch(err => {
                  console.log(err);
                });
            }
            if (dbResult.toString() !== approveString) {
              dbTokenContract.methods
                .approve(DOS_CONTRACT_ADDRESS)
                .send({ from: address })
                .then(result => {
                  console.log(`approve:${result}`);
                })
                .catch(err => {
                  console.log(err);
                });
            }
            notification.close(key);
          }}
        >
          Confirm
        </Button>
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
export function metaMaskLogin() {
  let { userAddress, web3Client } = store.getState().contract;
  //if (!userAddress) {
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

    window.ethereum.enable().then(approve);
    window.ethereum.on("accountsChanged", function(accounts) {
      let lastAccount = accounts[0];
      if (lastAccount) {
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
        store.dispatch({
          type: type.CONTRACT_USERADDRESS_CHANGE,
          address: accounts[0]
        });
        // setTimeout(() => {
        //     window.location.reload()
        // }, 2000);
      } else {
        notification.open({
          message: "MetaMask Account Change",
          description: (
            <>
              <h3>Lost Connection or Logged out!</h3>
            </>
          ),
          icon: <Icon type="smile" style={{ color: "#108ee9" }} />
        });

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
      // store.dispatch({ type: type.CONTRACT_USERADDRESS_CHANGE, address: accounts[0] })
    });
  } catch (e) {
    console.log(e);
  }
  // }
}

export function metaMaskLogout() {
  let { userAddress } = store.getState().contract;
  if (userAddress) {
    try {
      window.ethereum
        .enable()
        .then(function(accountAddress) {
          store.dispatch({
            type: type.CONTRACT_METAMASK_LOGOUT
          });
        })
        .then(() => {
          notification.open({
            message: "MetaMask Account",
            description: (
              <>
                <h3>Logged out!</h3>
              </>
            ),
            icon: <Icon type="smile" style={{ color: "#108ee9" }} />
          });
        });
    } catch (e) {
      console.log(e);
    }
  }
}
