export const EllipsisString = function (source, start, end) {
    let L = source.length - 1
    return `${source.slice(0,start)}....${source.slice(L-end,L)}`
}
