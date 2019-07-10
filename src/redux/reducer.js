import {
    combineReducers
} from 'redux';

import {
    handleActions
} from 'redux-actions'
import type from './type'

const globalState = {
    loadingStatus: false,
    userAddress: ''
}
const appState = {
    count: 0
}

const globalActions = {}
globalActions['LOADING_STATUS'] = (prevState, payload) => {
    console.log(`[reducer]LOADING_STATUS.............`)
    console.log(prevState, payload)
    return {
        ...globalState,
        loadingStatus: payload.loading
    }
}
globalActions[type.METAMASK_ADDRESS_CHANGE] = (prevState, payload) => {
    console.log(`[reducer]${type.METAMASK_ADDRESS_CHANGE}.............`)
    console.log(prevState, payload)
    return {
        ...globalState,
        userAddress: payload.address
    }
}
const globalReducer = handleActions(globalActions, globalState)

const appReducer = handleActions({
    'COUNTING'(prevState, payload) {
        console.log(`[reducer]COUNTING.............`)
        return {
            ...appState,
            count: prevState.count + 1
        }
    }
}, appState)


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
    app: appReducer
})


export const initialState = {
    global: globalState,
    app: appState
}
export default combinedReducers
