import ConstantVars from './const'
export const EmitterHandlerWrapper = (emitter, h, s, e, op = {}) => {
    let {
        emmiterName
    } = op
    let hashHandler = (hash) => {
        emitter.removeListener("transactionHash", hashHandler);
        h.call(this, hash)
    }
    let successHandler = (confirmationNumber, receipt) => {
        emitter.removeListener("confirmation", successHandler);
        s.call(this, confirmationNumber, receipt)
    }
    let errorHandler = (error) => {
        emitter.removeListener("error", errorHandler);
        e.call(this, error)
    }
    emitter.on("transactionHash", hashHandler);
    emitter.on("confirmation", successHandler);
    emitter.on("error", errorHandler);

    return () => {
        // console.log(`Emmiter:${emmiterName},all lisenter removed`)
        emitter.removeListener("transactionHash", hashHandler);
        emitter.removeListener("confirmation", successHandler);
        emitter.removeListener("error", errorHandler);
    }
}

export function GetConstantByNetWork(netWork) {
    // console.log(netWork)
    let result = ConstantVars[netWork]
    if (result) {
        return {
            ...result,
            CURRENT_NETWORK: netWork,
            SUPPORTED: !!result.DOS_CONTRACT_ADDRESS
        }
    } else {
        return {
            CURRENT_NETWORK: netWork,
            SUPPORTED: false
        }
    }
}
