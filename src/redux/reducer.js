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
    loadingStatus: false
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
    userAddress: '',
    isMetaMaskLogin: false
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
// globalActions[type.METAMASK_ADDRESS_CHANGE] = (prevState, payload) => {
//     console.log(`[reducer]${type.METAMASK_ADDRESS_CHANGE}.............`)
//     console.log(prevState, payload)
//     return {
//         ...globalState,
//         userAddress: payload.address
//     }
// }
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
    console.log(`[reducer]${type.CONTRACT_USERADDRESS_CHANGE}.............`)
    console.log(prevState, payload)
    return {
        ...contractState,
        userAddress: payload.address
    }
}
contractActions[type.CONTRACT_METAMASK_LOGIN] = (prevState, payload) => {
    console.log(`[reducer]${type.CONTRACT_METAMASK_LOGIN}.............`)
    console.log(prevState, payload)
    return {
        ...contractState,
        isMetaMaskLogin: true,
        userAddress: payload.address,
        web3Client: payload.web3Client
    }
}
contractActions[type.CONTRACT_METAMASK_LOGOUT] = (prevState, payload) => {
    console.log(`[reducer]${type.CONTRACT_METAMASK_LOGOUT}.............`)
    return {
        ...contractState,
        isMetaMaskLogin: false,
        userAddress: ''
    }
}

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
