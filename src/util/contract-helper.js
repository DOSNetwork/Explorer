import ConstantVars from './const'
import {
    DEFAULT_NETWORK
} from './const'
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
        case '42':
            result = 'kovan';
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
