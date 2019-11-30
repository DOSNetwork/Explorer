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
      let userBalance = await tokenContract.methods
        .balanceOf(userAddress)
        .call();
      let StakingContract = new web3Client.eth.Contract(
        DOS_ABI,
        DOS_CONTRACT_ADDRESS
      );
      let delegatedAmount = new web3Client.utils.toBN(0);
      let delegatedReward = new web3Client.utils.toBN(0);
      let unbondDelegated = new web3Client.utils.toBN(0);
      console.log(
        web3Client.utils.isBN(delegatedAmount),
        " delegatedAmount ",
        delegatedAmount.toString()
      );
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
          delegatedAmount = delegatedAmount.add(
            new web3Client.utils.toBN(node.selfStakedAmount)
          );
          delegatedReward = delegatedReward.add(
            new web3Client.utils.toBN(node.accumulatedReward)
          );
          unbondDelegated = unbondDelegated.add(
            new web3Client.utils.toBN(node.pendingWithdrawToken)
          );
          unbondDelegated = unbondDelegated.add(
            new web3Client.utils.toBN(node.pendingWithdrawDB)
          );
          console.log(
            Math.round(
              web3Client.utils.fromWei(delegatedAmount.toString()) * 100
            ) / 100,
            Math.round(
              web3Client.utils.fromWei(delegatedReward.toString()) * 100
            ) / 100,
            Math.round(
              web3Client.utils.fromWei(unbondDelegated.toString()) * 100
            ) / 100
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
          //TODO : BN add
          delegatedAmount = delegatedAmount.add(
            new web3Client.utils.toBN(delegator.delegatedAmount)
          );
          delegatedReward = delegatedReward.add(
            new web3Client.utils.toBN(delegator.delegatedReward)
          );
          unbondDelegated = unbondDelegated.add(
            new web3Client.utils.toBN(delegator.unbondDelegated)
          );
        }
        console.log(
          Math.round(
            web3Client.utils.fromWei(delegatedAmount.toString()) * 100
          ) / 100
        );
        this.setState({
          userBalance: Math.round(fromWei(userBalance) * 100) / 100,
          delegatedAmount:
            Math.round(
              web3Client.utils.fromWei(delegatedAmount.toString()) * 100
            ) / 100,
          delegatedReward:
            Math.round(
              web3Client.utils.fromWei(delegatedReward.toString()) * 100
            ) / 100,
          unbondDelegated:
            Math.round(
              web3Client.utils.fromWei(unbondDelegated.toString()) * 100
            ) / 100
        });
      }

      //Total Delegated
      //My Rewards
      //Unbonded tokens

      //TODO: Total Delegated ,My Rewards,Unbonded tokens
    }
  };
  render() {
    const {
      showNumber,
      userBalance,
      delegatedAmount,
      delegatedReward,
      unbondDelegated
    } = this.state;
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
              <p className="account-number">{delegatedAmount}</p>
            </div>
            <div className="detail--container">
              <DescLabel label="My Rewards" />
              <p className="account-number">{delegatedReward}</p>
            </div>
            <div className="detail--container">
              <DescLabel label="Unbonded tokens" />
              <p className="account-number">{unbondDelegated}</p>
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
