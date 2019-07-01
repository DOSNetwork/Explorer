
export function counting() {
    return {
        type: 'COUNTING'
    }
}

export function loading(loadingStatus) {
    return {
        type: 'LOADING_STATUS',
        loading: loadingStatus
    }
}

export default {
    counting,
    loading
}
