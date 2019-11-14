import { connect } from "react-redux";
import MyActivities from "./activities";

import { globalLoading } from "../../redux/action";

const mapStateToProps = state => ({
  contract: state.contract
});
const mapDispatchToProps = dispatch => ({
  globalLoading: loadingStatus => dispatch(globalLoading(loadingStatus))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyActivities);
