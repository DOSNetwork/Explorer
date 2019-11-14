import React, { Component } from "react";
import { Button } from "antd";
import { DOS_ABI, DOS_CONTRACT_ADDRESS } from "../../util/const";
import "./style.scss";
export default class NodeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node: this.props.match.params.nodeId,
      nodeDetail: {},
      isUserOwnedThisNode: false,
      isUserDelegatedThisNode: false,
      myTokenTotal: 0,
      myRewardTotal: 0,
      loading: false
    };
  }
  componentDidMount() {
    this.getNodeDetail();
  }
  getSnapshotBeforeUpdate(prevProps) {
    let userLogined =
      prevProps.contract.userAddress === "" && this.props.contract.userAddress;
    return { userLogined: userLogined };
  }
  componentDidUpdate(prevProps, preState, snapShot) {
    if (snapShot.userLogined) {
      this.getNodeDetail();
    }
  }
  getNodeDetail = async () => {
    function fromWei(bn) {
      if (!bn || bn === "-") {
        return "";
      }
      return web3Client.utils.fromWei(bn.toString("10"));
    }
    this.setState({
      loading: true
    });
    const { web3Client, userAddress } = this.props.contract;
    let contractInstance = new web3Client.eth.Contract(
      DOS_ABI,
      DOS_CONTRACT_ADDRESS
    );
    //TODO : Update nodeAddr from nodelist page
    const nodeAddr = this.state.node;
    const nodeInstance = await contractInstance.methods.nodes(nodeAddr).call();

    let uptime = await contractInstance.methods.getNodeUptime(nodeAddr).call();
    console.log(nodeAddr, " ", nodeInstance.selfStakedAmount, " ", uptime);
    const {
      selfStakedAmount,
      totalOtherDelegatedAmount,
      rewardCut,
      description
    } = nodeInstance;
    let nodeDelegators = nodeInstance.nodeDelegators;
    if (nodeDelegators != null) {
      console.log(nodeAddr, " nodeDelegators ", nodeDelegators.length);
    }

    const nodeDetail = {
      node: "",
      avatar: "",
      nodeAddr: nodeAddr,
      description: description,
      selfStakedAmount: fromWei(selfStakedAmount),
      totalOtherDelegatedAmount: fromWei(totalOtherDelegatedAmount),
      rewardCut: rewardCut.toString(),
      nodeUptime: Math.round(uptime.toNumber() / (60 * 60 * 24))
    };

    //TODO : updateGlobalRewardRate need to be called to get correct rewards
    if (userAddress === "") {
      this.setState({
        nodeDetail: nodeDetail
      });
    } else if (
      web3Client.utils.toChecksumAddress(userAddress) ===
      web3Client.utils.toChecksumAddress(nodeInstance.ownerAddr)
    ) {
      let rewardotal = await contractInstance.methods
        .getNodeRewardTokens(nodeAddr)
        .call();
      this.setState({
        isUserOwnedThisNode: true,
        myTokenTotal: fromWei(selfStakedAmount),
        myRewardTotal: fromWei(rewardotal),
        nodeDetail: nodeDetail
      });
    } else {
      console.log("userAddress ", userAddress);
      let delegator = await contractInstance.methods
        .delegators(userAddress, nodeAddr)
        .call();
      const { delegatedAmount } = delegator;
      let userDelegatedRewardotal = await contractInstance.methods
        .getDelegatorRewardTokens(userAddress, nodeAddr)
        .call();
      console.log(" delegatedAmount ", delegatedAmount);
      let isUserDelegatedThisNode = false;
      if (fromWei(delegatedAmount) !== 0) {
        isUserDelegatedThisNode = true;
      }
      this.setState({
        isUserDelegatedThisNode: isUserDelegatedThisNode,
        myTokenTotal: fromWei(delegatedAmount),
        myRewardTotal: fromWei(userDelegatedRewardotal),
        nodeDetail: nodeDetail
      });
    }
  };
  render() {
    const {
      node,
      avatar,
      nodeAddr,
      description,
      selfStakedAmount,
      totalOtherDelegatedAmount,
      rewardCut,
      nodeUptime
    } = this.state.nodeDetail;
    let { isMetaMaskLogin } = this.props.contract;
    let isUserDelegatedThisNode = this.state.isUserDelegatedThisNode;
    let isUserOwnedThisNode = this.state.isUserOwnedThisNode;
    return (
      <div>
        <div className="node-detail--info">
          <div className="info-avatar--wrapper">
            <img src={avatar} alt="" />
          </div>
          <div className="info-summary--wrapper">
            <p className="info-node">{node}</p>
            {isMetaMaskLogin ? (
              <p className="info-opt">
                {isUserOwnedThisNode ? (
                  <Button type="primary" shape="round" icon="solution">
                    updateNodeStaking
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    shape="round"
                    icon="solution"
                    disabled={!isUserDelegatedThisNode}
                  >
                    Delegate
                  </Button>
                )}
                {isUserOwnedThisNode ? (
                  <Button type="primary" shape="round" icon="solution">
                    Unregister
                  </Button>
                ) : null}
                <Button
                  shape="round"
                  icon="export"
                  disabled={!isUserDelegatedThisNode}
                >
                  Unbond
                </Button>
              </p>
            ) : null}
          </div>
        </div>
        <div className="node-detail--detail">
          {isMetaMaskLogin ? (
            <div className="detail--user-info">
              <div className="user-info--delegation">
                {isUserDelegatedThisNode ? (
                  <p className="user-info--title">My Delegation</p>
                ) : null}
                {isUserOwnedThisNode ? (
                  <p className="user-info--title">My Staking Token</p>
                ) : null}
                <p className="user-info--value">{this.state.myTokenTotal}</p>
              </div>
              <div className="user-info--rewards">
                <p className="user-info--title">My Rewards</p>
                <p className="user-info--value">{this.state.myRewardTotal}</p>
                <Button
                  className="widthdraw-button"
                  shape="round"
                  icon="dollar"
                  disabled={!isUserDelegatedThisNode}
                >
                  Withdraw Reward
                </Button>
              </div>
            </div>
          ) : null}
          <div className="node-detail--item">
            <div className="item--title">Node Address</div>
            <div className="item--value">{nodeAddr}</div>
          </div>
          <div className="node-detail--item">
            <div className="item--title">Node Description</div>
            <div className="item--value">{description}</div>
          </div>
          <div className="node-detail--item">
            <div className="item--title">Node Selt-Staked</div>
            <div className="item--value">{selfStakedAmount}</div>
          </div>
          <div className="node-detail--item">
            <div className="item--title">Total Delegated</div>
            <div className="item--value">{totalOtherDelegatedAmount}</div>
          </div>
          <div className="node-detail--item">
            <div className="item--title">Reward Cut</div>
            <div className="item--value">{rewardCut}%</div>
          </div>
          <div className="node-detail--item">
            <div className="item--title">Uptime</div>
            <div className="item--value">{nodeUptime} days</div>
          </div>
        </div>
      </div>
    );
  }
}
