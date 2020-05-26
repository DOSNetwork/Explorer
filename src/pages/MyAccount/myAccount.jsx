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
      delegatedTotal: -1,
      accumulatedRewardsTotal: -1,
      unbondingTotal: -1
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
    const { isWalletLogin, web3Client, userAddress, initialBlock, dosTokenContract, stakingContract } = this.props.contract;
    if (isWalletLogin) {
      let userBalance = await dosTokenContract.methods
        .balanceOf(userAddress)
        .call();

      let delegatedTotal = new web3Client.utils.toBN(0);
      let accumulatedRewardsTotal = new web3Client.utils.toBN(0);
      let unbondingTotal = new web3Client.utils.toBN(0);
      // Get node metadata
      if (userAddress !== "") {
        //Let owne and delegate nodes show first
        let nodeAddrs = [];
        const options = {
          filter: { owner: userAddress },
          fromBlock: initialBlock,
          toBlock: "latest"
        };
        const eventList = await stakingContract.getPastEvents(
          "NewNode",
          options
        );

        for (let i = 0; i < eventList.length; i++) {
          nodeAddrs.unshift(eventList[i].returnValues.nodeAddress);
        }
        const addrs = nodeAddrs.filter((item, index) => {
          return nodeAddrs.indexOf(item) === index;
        });
        for (let i = 0; i < addrs.length; i++) {
          const nodeAddr = addrs[i];
          const node = await stakingContract.methods
            .nodes(nodeAddr)
            .call();
          const accumulatedRewardsRT = await stakingContract.methods
            .getNodeRewardTokensRT(nodeAddr)
            .call();

          delegatedTotal = delegatedTotal.add(
            new web3Client.utils.toBN(node.selfStakedAmount)
          );
          accumulatedRewardsTotal = accumulatedRewardsTotal.add(
            new web3Client.utils.toBN(accumulatedRewardsRT)
          );
          unbondingTotal = unbondingTotal.add(
            new web3Client.utils.toBN(node.pendingWithdrawToken)
          );
//          unbondingTotal = unbondingTotal.add(
//            new web3Client.utils.toBN(node.pendingWithdrawDB)
//          );
        }
      }
      // Get delegated metadata
      if (userAddress !== "") {
        let nodeAddrs = [];
        const options2 = {
          filter: { from: userAddress },
          fromBlock: initialBlock,
          toBlock: "latest"
        };
        const eventList = await stakingContract.getPastEvents(
          "Delegate",
          options2
        );

        for (let i = 0; i < eventList.length; i++) {
          nodeAddrs.unshift(eventList[i].returnValues.to);
        }
        const addrs = nodeAddrs.filter((item, index) => {
          return nodeAddrs.indexOf(item) === index;
        });
        for (let i = 0; i < addrs.length; i++) {
          const nodeAddr = addrs[i];
          const delegator = await stakingContract.methods
            .delegators(userAddress, nodeAddr)
            .call();
          const accumulatedRewardsRT = await stakingContract.methods
            .getDelegatorRewardTokensRT(userAddress, nodeAddr)
            .call();

          delegatedTotal = delegatedTotal.add(
            new web3Client.utils.toBN(delegator.delegatedAmount)
          );
          accumulatedRewardsTotal = accumulatedRewardsTotal.add(
            new web3Client.utils.toBN(accumulatedRewardsRT)
          );
          unbondingTotal = unbondingTotal.add(
            new web3Client.utils.toBN(delegator.pendingWithdraw)
          );
        }
        if (this.unMount) {
          return;
        }
        this.setState({
          userBalance: Math.round(fromWei(userBalance) * 100) / 100,
          delegatedTotal:
            Math.round(
              web3Client.utils.fromWei(delegatedTotal.toString()) * 100
            ) / 100,
          accumulatedRewardsTotal:
            Math.round(
              web3Client.utils.fromWei(accumulatedRewardsTotal.toString()) * 100
            ) / 100,
          unbondingTotal:
            Math.round(
              web3Client.utils.fromWei(unbondingTotal.toString()) * 100
            ) / 100
        });
      }
    }
  };
  render() {
    const {
      showNumber,
      userBalance,
      delegatedTotal,
      accumulatedRewardsTotal,
      unbondingTotal
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
              <div className="account-number">{this.numberToggler(delegatedTotal)}</div>
            </div>
            <div className="detail--container">
              <DescLabel label={f({ id: 'Tooltip.MyAccount.MyRewards' })} />
              <div className="account-number">{this.numberToggler(accumulatedRewardsTotal)}</div>
            </div>
            <div className="detail--container">
              <DescLabel label={f({ id: 'Tooltip.MyAccount.Unbondingtokens' })} />
              <div className="account-number">{this.numberToggler(unbondingTotal)}</div>
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
