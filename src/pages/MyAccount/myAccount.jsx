import React, { Component } from "react";
import { Icon, Spin } from "antd";
import {
  DOS_ABI,
  DOS_CONTRACT_ADDRESS,
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
      netWork: "",
      userBalance: 0,
      delegatedAmount: 0,
      delegatedReward: 0,
      unbondDelegated: 0
    };
  }
  ToggleNumber = () => {
    this.setState(function(state) {
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
      let tokenContract = new web3Client.eth.Contract(
        DOSTOKEN_ABI,
        DOSTOKEN_CONTRACT_ADDRESS
      );
      let userBlaance = await tokenContract.methods
        .balanceOf(userAddress)
        .call();
      let StakingContract = new web3Client.eth.Contract(
        DOS_ABI,
        DOS_CONTRACT_ADDRESS
      );
      let delegatedAmount = 0;
      let delegatedReward = 0;
      let unbondDelegated = 0;
      //Get staking node and delegate node addresses
      if (userAddress !== "") {
        //Let owne and delegate nodes show first
        let nodesAddrs = [];
        const options = {
          filter: { owner: userAddress },
          fromBlock: 5414653,
          toBlock: "latest"
        };

        const eventList = await StakingContract.getPastEvents(
          "LogNewNode",
          options
        );
        console.log("eventList", eventList.length);

        for (let i = 0; i < eventList.length; i++) {
          nodesAddrs.unshift(eventList[i].returnValues.nodeAddress);
        }
        const addrs = nodesAddrs.filter((item, index) => {
          return nodesAddrs.indexOf(item) === index;
        });
        console.log("!!!", addrs.length);
        for (let i = 0; i < addrs.length; i++) {
          const nodeAddr = addrs[i];
          const node = await StakingContract.methods.nodes(nodeAddr).call();
          console.log(
            "test ",
            fromWei(node.selfStakedAmount),
            fromWei(node.accumulatedReward),
            fromWei(node.pendingWithdrawToken + node.pendingWithdrawDB)
          );
        }
      }
      //Get delegate node addresses
      if (userAddress !== "") {
        let nodesAddrs = [];
        const options2 = {
          filter: { sender: userAddress },
          fromBlock: 5414653,
          toBlock: "latest"
        };
        const eventList = await StakingContract.getPastEvents(
          "DelegateTo",
          options2
        );
        console.log("eventList", eventList.length);

        for (let i = 0; i < eventList.length; i++) {
          nodesAddrs.unshift(eventList[i].returnValues.nodeAddr);
        }
        const addrs = nodesAddrs.filter((item, index) => {
          return nodesAddrs.indexOf(item) === index;
        });
        console.log("!!!", addrs.length);
        for (let i = 0; i < addrs.length; i++) {
          const nodeAddr = addrs[i];
          const delegator = await StakingContract.methods
            .delegators(userAddress, nodeAddr)
            .call();
          delegatedAmount =
            delegatedAmount + fromWei(delegator.delegatedAmount);
          console.log(
            "test ",
            fromWei(delegator.delegatedAmount),
            fromWei(delegator.delegatedReward),
            fromWei(delegator.unbondDelegated)
          );
        }
        console.log(delegatedAmount, delegatedReward, unbondDelegated);

        this.setState({
          userBalance: Math.round(fromWei(userBlaance) * 100) / 100,
          delegatedAmount: delegatedAmount,
          delegatedReward: delegatedReward,
          unbondDelegated: unbondDelegated
        });
      }

      //Total Delegated
      //My Rewards
      //Unbonded tokens

      //TODO: Total Delegated ,My Rewards,Unbonded tokens
    }
  };
  render() {
    const { showNumber, userBalance } = this.state;
    return (
      <>
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
              <p className="account-number">{this.numberToggler("0")}</p>
            </div>
            <div className="detail--container">
              <DescLabel label="My Rewards" />
              <p className="account-number">{this.numberToggler("0")}</p>
            </div>
            <div className="detail--container">
              <DescLabel label="Unbonded tokens" />
              <p className="account-number">{this.numberToggler("0")}</p>
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
