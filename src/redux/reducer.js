import {
    combineReducers
} from 'redux';

import {
    handleActions
} from 'redux-actions'
import type from './type'

// ===States 
// =====global state
const globalState = {
    loadingStatus: false,
    userAddress: ''
}
// =====app state
const appState = {
    count: 0
}

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
export const initialState = {
    global: globalState,
    app: appState,
    explorer: explorerState
}

// ===Reducers
// =====globalReducer
const globalActions = {}
//globalActions['LOADING_STATUS'] = (prevState, payload) => {
// console.log(`[reducer]LOADING_STATUS.............`)
// console.log(prevState, payload)
//    return {
//        ...globalState,
//        loadingStatus: payload.loading
//    }
//}
globalActions[type.METAMASK_ADDRESS_CHANGE] = (prevState, payload) => {
    console.log(`[reducer]${type.METAMASK_ADDRESS_CHANGE}.............`)
    console.log(prevState, payload)
    return {
        ...globalState,
        userAddress: payload.address
    }
}
const globalReducer = handleActions(globalActions, globalState)


// =====appReducer
const appReducer = handleActions({
    'COUNTING'(prevState, payload) {
        console.log(`[reducer]COUNTING.............`)
        return {
            ...appState,
            count: prevState.count + 1
        }
    }
}, appState)


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
const explorerReducer = handleActions(explorerActions, explorerState)

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
    app: appReducer,
    explorer: explorerReducer
})



export default combinedReducers
