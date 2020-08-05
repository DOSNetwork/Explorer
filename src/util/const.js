import * as abis from './abis'
import contract from './contract-const'

export const STAKING_ABI = abis.STAKING_ABI
export const DBTOKEN_ABI = abis.DBTOKEN_ABI
export const DOSTOKEN_ABI = abis.DOSTOKEN_ABI
export const DEFAULT_NETWORK = process.env.REACT_APP_DEFAULT_NETWORK
// 2^256 - 1
export const MAX_ALLOWANCE = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

export default contract
