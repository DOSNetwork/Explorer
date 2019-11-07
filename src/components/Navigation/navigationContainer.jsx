import { connect } from 'react-redux'
import Navigation from './navigation'

const mapStateToProps = (state) => ({
    contract: state.contract
})
const mapDispatchToProps = () => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
