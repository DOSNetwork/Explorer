import { connect } from 'react-redux'
import MarketInfo from './marketInfo.jsx'

const mapStateToProps = (state) => ({
    contract: state.contract
})
const mapDispatchToProps = () => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(MarketInfo)
