import {
    combineReducers
} from 'redux';

import {
    handleActions
} from 'redux-actions'

const globalState = {
    loadingStatus: false
}
const appState = {
    count: 0
}
const globalReducer = handleActions({
    'LOADING_STATUS'(prevState, action) {
        console.log(`[reducer]LOADING_STATUS.............`)
        console.log(prevState, action)
        return {
            ...appState,
            loadingStatus: action.loading
        }
    }
}, globalState)

const appReducer = handleActions({
    'COUNTING'(prevState, action) {
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
