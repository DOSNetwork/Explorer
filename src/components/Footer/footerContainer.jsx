import { connect } from 'react-redux'
import Footer from './footer'

const mapStateToProps = (state) => ({
    global: state.global
})
const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
