import { connect } from 'react-redux'
import Search from './search'
import { ExplorerSearch } from '../../redux/action'

const mapStateToProps = (state) => state.explorer
const mapDispatchToProps = dispatch => ({
    explorerSearch: (text, pageSize, pageIndex) => dispatch(ExplorerSearch(text, pageSize, pageIndex))
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)
