export const EmitterHandlerWrapper = (emitter, h, s, e) => {
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
}
