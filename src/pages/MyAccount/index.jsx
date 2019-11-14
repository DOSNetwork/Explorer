import React, { Component } from "react";
import { PageTitle } from "../../Layout/page";
import Activities from "./myActivitiesContainer";
import Account from "./myAccountContainer";
import "./style.scss";
export default class MyAccount extends Component {
  render() {
    return (
      <div>
        <PageTitle title="My Account"></PageTitle>
        <Account></Account>
        <Activities></Activities>
      </div>
    );
  }
}
