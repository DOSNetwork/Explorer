import React, { Component } from "react";
import { injectIntl } from 'react-intl'
import { Icon, Spin } from "antd";
import numeral from 'numeral'
import { getPastEventsWithFallback } from "../../util/contract-helper";
const numberFormatRender = (value) => {
  return numeral(value).format("0,0.00");
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
      withdrawableTotal: -1,
      frozenTotal: -1
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
    const {
      isWalletLogin,
      web3Client,
      userAddress,
      initialBlock,
      api,
      dosTokenContract,
      stakingContract
    } = this.props.contract;
    if (isWalletLogin) {
      let userBalance = await dosTokenContract.methods
        .balanceOf(userAddress)
        .call();

      let delegatedTotal = new web3Client.utils.toBN(0);
      let accumulatedRewardsTotal = new web3Client.utils.toBN(0);
      let frozenTotal = new web3Client.utils.toBN(0);
      let withdrawableTotal = new web3Client.utils.toBN(0);
      // Get owned node metadata
      if (userAddress !== "") {
        let nodeAddrs = [];
        const eventList = await getPastEventsWithFallback(
          stakingContract,
          'NewNode',
          initialBlock,
          [userAddress],
          api,
          web3Client
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
          const nodeWithdrawable = await stakingContract.methods
            .nodeWithdrawable(userAddress, nodeAddr)
            .call();
          const nodeFrozen = new web3Client.utils.toBN(node.pendingWithdrawToken)
            .sub(new web3Client.utils.toBN(nodeWithdrawable[0]));

          delegatedTotal = delegatedTotal.add(
            new web3Client.utils.toBN(node.selfStakedAmount)
          );
          accumulatedRewardsTotal = accumulatedRewardsTotal.add(
            new web3Client.utils.toBN(accumulatedRewardsRT)
          );
          withdrawableTotal = withdrawableTotal.add(
            new web3Client.utils.toBN(nodeWithdrawable[0])
          );
          frozenTotal = frozenTotal.add(
            new web3Client.utils.toBN(nodeFrozen)
          );
        }
      }
      // Get delegation metadata
      if (userAddress !== "") {
        let nodeAddrs = [];
        const eventList = await getPastEventsWithFallback(
          stakingContract,
          'Delegate',
          initialBlock,
          [userAddress],
          api,
          web3Client
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
          const withdrawable = await stakingContract.methods
            .delegatorWithdrawable(userAddress, nodeAddr)
            .call();
          const frozen = new web3Client.utils.toBN(delegator.pendingWithdraw)
            .sub(new web3Client.utils.toBN(withdrawable));

          delegatedTotal = delegatedTotal.add(
            new web3Client.utils.toBN(delegator.delegatedAmount)
          );
          accumulatedRewardsTotal = accumulatedRewardsTotal.add(
            new web3Client.utils.toBN(accumulatedRewardsRT)
          );
          withdrawableTotal = withdrawableTotal.add(
            new web3Client.utils.toBN(withdrawable)
          );
          frozenTotal = frozenTotal.add(
            new web3Client.utils.toBN(frozen)
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
          withdrawableTotal:
            Math.round(
              web3Client.utils.fromWei(withdrawableTotal.toString()) * 100
            ) / 100,
          frozenTotal:
            Math.round(
              web3Client.utils.fromWei(frozenTotal.toString()) * 100
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
      withdrawableTotal,
      frozenTotal
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
              <div className="account-number">
                {this.numberToggler(withdrawableTotal)} / {this.numberToggler(frozenTotal)}
              </div>
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
      <span className="desc-market">({market})</span>
    </span>
  );
};
