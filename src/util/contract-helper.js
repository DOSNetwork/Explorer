import ConstantVars from './const'
import {
    DEFAULT_NETWORK
} from './const'
const fetch = require('node-fetch')

export const EmitterHandlerWrapper = (emitter, h, s, e, op = {}) => {
    let hashHandler = (hash) => {
        emitter.removeListener("transactionHash", hashHandler);
        h.call(this, hash)
    }
    let successHandler = (confirmationNumber, receipt) => {
        emitter.removeListener("confirmation", successHandler);
        s.call(this, confirmationNumber, receipt)
    }
    let errorHandler = (error) => {
        emitter.removeListener("error", errorHandler);
        e.call(this, error)
    }
    emitter.on("transactionHash", hashHandler);
    emitter.on("confirmation", successHandler);
    emitter.on("error", errorHandler);

    return () => {
        // console.log(`Emmiter:${emmiterName},all lisenter removed`)
        emitter.removeListener("transactionHash", hashHandler);
        emitter.removeListener("confirmation", successHandler);
        emitter.removeListener("error", errorHandler);
    }
}

export const getPastEventsWithFallback = async(contract, eventName, fromBlock, indexed_arg_array, api, web3) => {
  const abi = contract.options.jsonInterface.find(abi => abi.type === 'event' && abi.name === eventName)
  let topics = [web3.eth.abi.encodeEventSignature(abi)];  // topic0
  for (let i = 0; i < indexed_arg_array.length; i++) {
    if (indexed_arg_array[i] == null) {
      topics.push(null)
    } else {
      topics.push(web3.eth.abi.encodeParameter('address', indexed_arg_array[i]))
    }
  }
  let options = {
    fromBlock: fromBlock,
    toBlock: 'latest',
    topics: topics,
  }
  try {
    return await contract.getPastEvents(eventName, options)
  } catch(e) {
    if (api && web3) {
      console.log('fallback scanner api...');
      return await getLogsFromEtherscan(api, web3, contract, eventName, options)
    } else {
      return [];
    }
  }
}

const getLogsFromEtherscan = async(api, web3, contract, eventName, options) => {
  const url = new URL(api)
  url.searchParams.append('module', 'logs')
  url.searchParams.append('action', 'getLogs')
  url.searchParams.append('address', contract.options.address)
  url.searchParams.append('fromBlock', options.fromBlock ? options.fromBlock.toString() : '1')
  url.searchParams.append('toBlock', (options.toBlock || 'latest').toString())

  const abi = contract.options.jsonInterface.find(abi => abi.type === 'event' && abi.name === eventName)
  const topics = [...(options.topics || [])]
  for (let i = 0; i < topics.length; i++) {
    if (topics[i] !== null) {
      url.searchParams.append(`topic${i}`, topics[i])
      for (let j = 0; j < i; j++) {
        if (topics[j] !== null) {
          url.searchParams.append(`topic${j}_${i}_opr`, 'and')
        }
      }
    }
  }

  const logs = await fetch(url.toString()).then(res => res.json())
  return logs.result.map(log => ({
    transactionHash: log.transactionHash,
    blockNumber: parseInt(log.blockNumber.slice(2), 16),
    returnValues: web3.eth.abi.decodeLog(abi.inputs, log.data, log.topics.slice(1)),
    event: eventName
  }))
}

function GetNetwork(networkId) {
    let result;
    switch (networkId) {
        case '1':
            result = "mainnet";
            break
        case '2':
            result = "morden";
            break
        case '3':
            result = "ropsten";
            break
        case '4':
            result = "rinkeby";
            break
        case '5':
            result = "goerli";
            break
        case '42':
            result = 'kovan';
            break;
        case '56':
            result = 'bsc';
            break;
        case '65':
            result = 'okchain-testnet';
            break;
        case '97':
            result = 'bsc-testnet';
            break;
        case '128':
            result = 'heco';
            break;
        case '256':
            result = 'heco-testnet';
            break;
        default:
            result = "unknown";
    }
    return result
}
export function GetConstantByNetWork(netWorkId) {
    let WALLET_NETWORK_SUPPORTED = true
    let network = GetNetwork(netWorkId)
    let USER_WALLET_NETWORK = network;
    let result = ConstantVars[network]
    // 如果地址常量没配置,则切换到默认网络
    if (!result || !result.STAKING_CONTRACT_ADDRESS) {
        network = GetNetwork(DEFAULT_NETWORK)
        result = ConstantVars[network]
        WALLET_NETWORK_SUPPORTED = false;
    }
    return {
        ...result,
        CURRENT_NETWORK: network,
        WALLET_NETWORK_SUPPORTED: WALLET_NETWORK_SUPPORTED,
        USER_WALLET_NETWORK
    }
}
