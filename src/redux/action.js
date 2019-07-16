import type from './type'
import axios from 'axios'
export function counting() {
    return {
        type: 'COUNTING'
    }
}

export function globalLoading(loadingStatus) {
    return {
        type: 'LOADING_STATUS',
        loading: loadingStatus
    }
}

export function addressChange(address) {
    return {
        type: type.METAMASK_ADDRESS_CHANGE,
        address: address
    }
}


function explorerSearchReceiveResponse(data) {
    return {
        type: type.EXPLORER_SEARCH_RESPONSE,
        response: data
    }
}

function ExplorerSearching(searchText, pageSize, pageIndex) {
    return {
        type: type.EXPLORER_SEARCH_REQUEST,
        searchText: searchText,
        pageSize,
        pageIndex
    }
}

function ExplorerSearchRequest(searchText, pageSize, pageIndex) {
    console.log(searchText, pageSize, pageIndex)
    return (dispatch) => {
        return axios.get('/api/explorer/search', { params: { text: searchText, pageSize: pageSize, pageIndex: pageIndex } }).then(response => {
            let data = response.data.body
            dispatch(explorerSearchReceiveResponse(data))
        })
    }
}
export function ExplorerSearch(text = '', pageSize = 20, pageIndex = 0) {
    return (dispatch) => {
        dispatch(ExplorerSearching(text, pageSize, pageIndex))
        return dispatch(ExplorerSearchRequest(text, pageSize, pageIndex))
    }
}

export default {
    counting,
    globalLoading,
    addressChange
}
