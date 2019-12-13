import {
    createStore,
    applyMiddleware
} from 'redux';
import combinedReducers, {
    initialState
} from './reducer';

import promise from 'redux-promise';
import thunk from 'redux-thunk';

// eslint-ignore
// function middlewareLogger(store) {
//     return next => action => {
//         // console.log('[logger]will dispatch', action)

//         // Call the next dispatch method in the middleware chain.
//         const returnValue = next(action)

//         // console.log('[logger]state after dispatch', store.getState())

//         // This will likely be the action itself, unless
//         // a middleware further in chain changed it.
//         return returnValue
//     }
// }


const store = createStore(combinedReducers, initialState, applyMiddleware(thunk, promise), );

export default store;
