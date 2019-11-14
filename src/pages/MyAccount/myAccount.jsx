import React, { Component } from "react";
import { SubTitle } from "../../Layout/page";
import { Icon, Spin } from "antd";
import {
  // DOS_ABI,
  // DOS_CONTRACT_ADDRESS,
  DOSTOKEN_ABI,
  DOSTOKEN_CONTRACT_ADDRESS
} from "../../util/const";

export default class Account extends Component {
  constructor(props) {
    super(props);
    console.log("prop", props);
    this.state = {
      showNumber: true,
      userContract: null,
      netWork: ""
    };
  }
  ToggleNumber = () => {
    this.setState(function (state) {
      return {
        showNumber: !state.showNumber
      };
    });
  };
  numberToggler = value => {
    const isMetaMaskLogin = this.props.contract.isMetaMaskLogin;
    if (isMetaMaskLogin) {
      return this.state.showNumber ? value ? value : <Spin /> : "***";
    } else {
      return "-";
    }
  };
  getSnapshotBeforeUpdate(prevProps) {
    let userLogined =
      prevProps.contract.userAddress === "" && this.props.contract.userAddress;
    return { userLogined: userLogined };
  }
  componentDidUpdate(prevProps, preState, snapShot) {
    if (snapShot.userLogined) {
      this.loadUserBalance();
    }
  }
  componentDidMount() {
    this.loadUserBalance();
  }
  loadUserBalance = async () => {
    function fromWei(bn) {
      if (!bn || bn === "-") {
        return "";
      }
      return web3Client.utils.fromWei(bn.toString("10"));
    }
    this.props.globalLoading(true);
    const { isMetaMaskLogin, web3Client, userAddress } = this.props.contract;
    if (isMetaMaskLogin) {
      const token = new web3Client.eth.Contract(
        DOSTOKEN_ABI,
        DOSTOKEN_CONTRACT_ADDRESS
      );
      let balance = await token.methods.balanceOf(userAddress).call();
      this.setState({
        userBalance: fromWei(balance)
      });
      //TODO: Total Delegated ,My Rewards,Unbonded tokens
    } else {
      this.setState({
        userBalance: "No Account"
      });
    }
  };
  render() {
    const { showNumber, userBalance } = this.state;
    return (
      <>
        <SubTitle title="My Account"></SubTitle>
        <div className="myaccount--wrapper">
          <div className="myaccount-balance">
            <DescLabel label="Account Balance" />
            <Icon
              style={{ fontSize: 27, marginLeft: 30, cursor: "pointer" }}
              type={showNumber ? "eye" : "eye-invisible"}
              onClick={this.ToggleNumber}
            />
            <div className="account-number big-size">
              {this.numberToggler(userBalance)}
            </div>
          </div>
          <div className="myaccount-detail--wrapper">
            <div className="detail--container">
              <DescLabel label="Total Delegated" />
              <p className="account-number">{this.numberToggler("8,999.91")}</p>
            </div>
            <div className="detail--container">
              <DescLabel label="My Rewards" />
              <p className="account-number">
                {this.numberToggler("18,999.91")}
              </p>
            </div>
            <div className="detail--container">
              <DescLabel label="Unbonded tokens" />
              <p className="account-number">{this.numberToggler("999")}</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const DescLabel = ({ label, market = "DOS" }) => {
  return (
    <span className="desc-label">
      {label}
      <span className="desc-market">/{market}</span>
    </span>
  );
};
