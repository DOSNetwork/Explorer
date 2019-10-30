import { connect } from 'react-redux'
import nodeList from './nodeList'
import { globalLoading } from '../../redux/action'

const mapStateToProps = () => ({})
const mapDispatchToProps = dispatch => ({
    globalLoading: loadingStatus => dispatch(globalLoading(loadingStatus))
})

export default connect(mapStateToProps, mapDispatchToProps)(nodeList)
