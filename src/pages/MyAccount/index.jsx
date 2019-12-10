import React, { Component } from "react";
import { injectIntl } from 'react-intl'
import { PageTitle } from "../../Layout/page";
import Activities from "./myActivitiesContainer";
import Account from "./myAccountContainer";
import {
  MyAccountIcon,
} from '../../components/SvgIcon/icons.jsx'
import "./style.scss";
class MyAccount extends Component {
  render() {
    let { formatMessage: f } = this.props.intl;
    return (
      <div>
        <PageTitle title={() => (<><MyAccountIcon />&nbsp;{f({ id: "Title.myaccount" })}</>)}></PageTitle>
        <Account></Account>
        <Activities></Activities>
      </div>
    );
  }
}
export default injectIntl(MyAccount)
