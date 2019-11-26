import { connect } from 'react-redux'
import nodeList from './nodeList'
import { globalLoading, SetConfig_OnlyRelatedToMe } from '../../redux/action'

const mapStateToProps = (state) => ({
    contract: state.contract,
    showRelatedNodes: state.global.config_onlyShowRelatedToMe
})
const mapDispatchToProps = dispatch => ({
    globalLoading: loadingStatus => dispatch(globalLoading(loadingStatus)),
    setShowRelatedNodes: (value) => dispatch(SetConfig_OnlyRelatedToMe(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(nodeList)
