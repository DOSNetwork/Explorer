import React, { Component } from "react";
import { injectIntl } from 'react-intl'
import { Icon, Spin } from "antd";
import numeral from 'numeral'
const numberFormatRender = (value) => {
  return numeral(value).format("0,0");
};
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNumber: true,
      userContract: null,
      netWork: "",
      userBalance: -1,
      delegatedAmount: -1,
      delegatedReward: -1,
      unbondDelegated: -1
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
    const isWalletLogin = this.props.contract.isWalletLogin;
    if (isWalletLogin) {
      return this.state.showNumber ? (value >= 0 ? numberFormatRender(+value) : <Spin />) : "***";
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
  componentWillUnmount() {
    this.unMount = true;
  }
  loadUserBalance = async () => {
    function fromWei(bn) {
      if (!bn || bn === "-") {
        return "";
      }
      return web3Client.utils.fromWei(bn.toString("10"));
    }
    this.props.globalLoading(true);
    const { isWalletLogin, web3Client, userAddress, dosTokenContract, dosContract } = this.props.contract;
    if (isWalletLogin) {
      let userBalance = await dosTokenContract.methods
        .balanceOf(userAddress)
        .call();

      let delegatedAmount = new web3Client.utils.toBN(0);
      let delegatedReward = new web3Client.utils.toBN(0);
      let unbondDelegated = new web3Client.utils.toBN(0);
      //Get staking node and delegate node addresses
      if (userAddress !== "") {
        //Let owne and delegate nodes show first
        let nodesAddrs = [];
        const options = {
          filter: { owner: userAddress },
          fromBlock: 5414653,
          toBlock: "latest"
        };

        const eventList = await dosContract.getPastEvents(
          "LogNewNode",
          options
        );

        for (let i = 0; i < eventList.length; i++) {
          nodesAddrs.unshift(eventList[i].returnValues.nodeAddress);
        }
        const addrs = nodesAddrs.filter((item, index) => {
          return nodesAddrs.indexOf(item) === index;
        });
        // // console.log("!!!", addrs.length);
        for (let i = 0; i < addrs.length; i++) {
          const nodeAddr = addrs[i];
          const node = await dosContract.methods.nodes(nodeAddr).call();
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
        const eventList = await dosContract.getPastEvents(
          "DelegateTo",
          options2
        );

        for (let i = 0; i < eventList.length; i++) {
          nodesAddrs.unshift(eventList[i].returnValues.nodeAddr);
        }
        const addrs = nodesAddrs.filter((item, index) => {
          return nodesAddrs.indexOf(item) === index;
        });
        for (let i = 0; i < addrs.length; i++) {
          const nodeAddr = addrs[i];
          const delegator = await dosContract.methods
            .delegators(userAddress, nodeAddr)
            .call();

          if (delegator.delegatedAmount) {
            delegatedAmount = delegatedAmount.add(
              new web3Client.utils.toBN(delegator.delegatedAmount)
            );
          }
          if (delegator.delegatedReward) {
            delegatedReward = delegatedReward.add(
              new web3Client.utils.toBN(delegator.delegatedReward)
            );
          }
          if (delegator.unbondDelegated) {
            unbondDelegated = unbondDelegated.add(
              new web3Client.utils.toBN(delegator.unbondDelegated)
            );
          }
        }
        if (this.unMount) {
          return;
        }
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
    let { formatMessage: f } = this.props.intl;
    return (

      <>
        <div className="myaccount--wrapper">
          <div className="myaccount-balance">
            <DescLabel label={f({ id: 'Tooltip.MyAccount.AccountBalance' })} />
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
              <DescLabel label={f({ id: 'Tooltip.MyAccount.TotalDelegated' })} />
              <div className="account-number">{this.numberToggler(delegatedAmount)}</div>
            </div>
            <div className="detail--container">
              <DescLabel label={f({ id: 'Tooltip.MyAccount.MyRewards' })} />
              <div className="account-number">{this.numberToggler(delegatedReward)}</div>
            </div>
            <div className="detail--container">
              <DescLabel label={f({ id: 'Tooltip.MyAccount.Unbondedtokens' })} />
              <div className="account-number">{this.numberToggler(unbondDelegated)}</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default injectIntl(Account)


const DescLabel = ({ label, market = "DOS" }) => {
  return (
    <span className="desc-label">
      {label}
      <span className="desc-market">/{market}</span>
    </span>
  );
};
