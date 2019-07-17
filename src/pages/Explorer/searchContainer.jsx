import { connect } from 'react-redux'
import Search from './search'
import { ExplorerSearch } from '../../redux/action'
import { withRouter } from "react-router";
const mapStateToProps = (state) => ({ searchResult: state.explorer })
const mapDispatchToProps = dispatch => ({
    explorerSearch: (text, pageSize, pageIndex, history) => dispatch(ExplorerSearch(text, pageSize, pageIndex, history))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search))
