import { connect } from 'react-redux'
import Footer from './footer'
import { changeLang } from "../../redux/action";
const mapStateToProps = (state) => ({
    global: state.global
})
const mapDispatchToProps = dispatch => ({
    changeLang: lang => dispatch(changeLang(lang))
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
