import { connect } from 'react-redux'
import nodeDetail from './nodeDetail'
import { globalLoading } from '../../redux/action'

const mapStateToProps = () => ({})
const mapDispatchToProps = dispatch => ({
    globalLoading: loadingStatus => dispatch(globalLoading(loadingStatus))
})

export default connect(mapStateToProps, mapDispatchToProps)(nodeDetail)
