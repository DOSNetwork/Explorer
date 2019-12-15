import { connect } from 'react-redux'
import Navigation from './navigation'
import { changeLang } from "../../redux/action";
const mapStateToProps = (state) => ({
    contract: state.contract,
    global: state.global
})
const mapDispatchToProps = (dispatch) => ({
    changeLang: lang => dispatch(changeLang(lang))
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
