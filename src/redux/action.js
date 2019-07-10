import type from './type'
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
export default {
    counting,
    globalLoading,
    addressChange
}
