import * as abis from './abis'
import contract from './contract-const'

export const DOS_ABI = abis.DOS_ABI
export const DB_ABI = abis.DB_ABI
export const DOSTOKEN_ABI = abis.DOSTOKEN_ABI
export const DEFAULT_NETWORK = process.env.REACT_APP_DEFAULT_NETWORK
export const approveString = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

export default contract
