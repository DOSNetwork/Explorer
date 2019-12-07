import React, { Component } from "react";
import { PageTitle } from "../../Layout/page";
import Activities from "./myActivitiesContainer";
import Account from "./myAccountContainer";
import {
  MyAccountIcon,
} from '../../components/SvgIcon/icons.jsx'
import "./style.scss";
export default class MyAccount extends Component {
  render() {
    return (
      <div>
        <PageTitle title={()=>(<><MyAccountIcon/>&nbsp;My Account</>)}></PageTitle>
        <Account></Account>
        <Activities></Activities>
      </div>
    );
  }
}
