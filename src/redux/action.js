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

function ExplorerSearchRequest(searchText, pageSize, pageIndex, history) {
    return (dispatch) => {
        return axios.get('/api/explorer/search', {
            params: {
                text: searchText,
                pageSize: pageSize,
                pageIndex: pageIndex
            }
        }).then(response => {
            let data = response.data.body
            dispatch(explorerSearchReceiveResponse(data))
            let {
                request,
                group,
                address
            } = data
            if (request && request.length > 0) {
                let id = request[0].requestId
                history.push(`/explorer/request/${id}`)
            } else if (group && group.length > 0) {
                let id = group[0].groupId
                history.push(`/explorer/group/${id}`)
            } else if (address && address.length > 0) {
                let id = address[0].addr
                history.push(`/explorer/address/${id}`)
            } else {
                history.push(`/explorer`)
            }
        })
    }
}
export function ExplorerSearch(text = '', pageSize = 20, pageIndex = 0, history) {
    return (dispatch) => {
        dispatch(ExplorerSearching(text, pageSize, pageIndex))
        return dispatch(ExplorerSearchRequest(text, pageSize, pageIndex, history))
    }
}

export default {
    counting,
    globalLoading,
    addressChange
}
