import {
    combineReducers
} from 'redux';

import {
    handleActions
} from 'redux-actions'
import type from './type'

// ===States 
// ===== global state
const globalState = {
    loadingStatus: false,
    config_onlyShowRelatedToMe: false,
    lang: ''
}
// =====app state
// const appState = {
//     count: 0
// }

// ===== explorer state
const explorerState = {
    loading: false,
    events: [],
    group: [],
    address: [],
    random: [],
    url: [],
    totalCount: 0,
    currentPageIndex: 0,
    pageSize: 20,
    searchText: '',
    showType: 'EVENT'
}


// ===== contract state
const contractState = {
    web3Client: null,
    dosTokenContract: null,
    dbTokenContract: null,
    dosContract: null,
    isWalletLogin: false,
    userAddress: '',
    network: '',
    constant: {},
    networkSupported: false,
    initialBlock: 0
}
export const initialState = {
    global: globalState,
    // app: appState,
    explorer: explorerState,
    contract: contractState
}

// ===Reducers
// ===== globalAction
const globalActions = {}
globalActions[type.GLOBAL_CONFIG_CHANGE_OSLM] = (prevState, payload) => {
    return {
        ...globalState,
        config_onlyShowRelatedToMe: payload.config_onlyShowRelatedToMe
    }
}
globalActions[type.CONTRACT_METAMASK_LOGOUT] = (prevState, payload) => {
    return {
        ...globalState,
        config_onlyShowRelatedToMe: false
    }
}
globalActions[type.GLOBAL_CONFIG_SET_LANG] = (prevState, payload) => {
    let {
        lang
    } = payload
    localStorage.setItem('DOSNETWORK_LANG', lang)
    return {
        ...globalState,
        lang
    }
}
globalActions[type.GLOBAL_CONFIG_CHANGE_LANG] = (prevState, payload) => {
    let {
        lang
    } = payload
    localStorage.setItem('DOSNETWORK_LANG', lang)
    setTimeout(() => {
        window.location.reload()
    }, 1000);
    return {
        ...globalState,
        lang
    }
}

// ===== globalReducerCONTRACT_USERADDRESS_CHANGE
const globalReducer = handleActions(globalActions, globalState)



// ===== explorerAction
const explorerActions = {}
explorerActions[type.EXPLORER_SEARCH_RESPONSE] = (prevState, payload) => {
    let events = payload.response.events;
    let random = payload.response.random;
    let url = payload.response.url;
    let group = payload.response.group;
    let address = payload.response.address;
    return {
        ...prevState,
        loading: false,
        events: events,
        random: random,
        url: url,
        group: group,
        address: address,
        totalCount: payload.response.totalCount
    }
}

explorerActions[type.EXPLORER_SEARCH_REQUEST] = (prevState, payload) => {
    return {
        ...prevState,
        loading: true,
        currentPageIndex: payload.pageIndex,
        pageSize: payload.pageSize,
        searchText: payload.searchText
    }
}
// ===== explorerReducer
const explorerReducer = handleActions(explorerActions, explorerState)


// ===== contractAction
const contractActions = {}
// contract types here --->
// CONTRACT_WEB3_CLINET_INIT
// CONTRACT_METAMASK_LOGIN
// CONTRACT_METAMASK_LOGOUT
// CONTRACT_USERADDRESS_CHANGE
// ===== contractReducer
contractActions[type.CONTRACT_USERADDRESS_CHANGE] = (prevState, payload) => {
    return {
        ...prevState,
        userAddress: payload.address
    }
}
contractActions[type.CONTRACT_METAMASK_LOGIN] = (prevState, payload) => {
    return {
        ...prevState,
        isWalletLogin: true,
        userAddress: payload.address
    }
}
contractActions[type.CONTRACT_METAMASK_LOGOUT] = (prevState, payload) => {
    return {
        ...prevState,
        isWalletLogin: false,
        userAddress: ''
    }
}


contractActions[type.CONTRACT_WEB3_CLINET_INIT] = (prevState, payload) => {
    let {
        web3Client,
        dosTokenContract,
        dbTokenContract,
        dosContract,
        network,
        constant,
        networkSupported,
        initialBlock
    } = payload
    return {
        ...prevState,
        web3Client,
        dosTokenContract,
        dbTokenContract,
        dosContract,
        network,
        constant,
        networkSupported,
        initialBlock
    }
}

// contractActions[type.WALLET_NETWORK_CHANGE] = (prevState, payload) => {
//     return {
//         ...prevState,
//         network: payload.network,
//         ...payload.CONST
//     }
// }

const contractReducer = handleActions(contractActions, contractState)
/**
 *  最后产生的reducer和 state的属性要保持一致
 * 
 * reducer:{
 *  a,
 *  b
 * }
 * 
 * state:{
 *  a,
 *  b
 * }
 */
const combinedReducers = combineReducers({
    global: globalReducer,
    // app: appReducer,
    explorer: explorerReducer,
    contract: contractReducer
})



export default combinedReducers
