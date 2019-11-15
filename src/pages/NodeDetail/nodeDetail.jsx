import React, { Component } from "react";
import { Button } from "antd";
import { DOS_ABI, DOS_CONTRACT_ADDRESS } from "../../util/const";
import DelegateNode from "./delegateNodeForm";
import UnbondNode from "./unbondNodeForm";
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
      loading: false,
      delegateFormVisible: false,
      delegateFormLoading: false,
      unbondFormVisible: false,
      unbondFormLoading: false,
      formText: ""
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
  showDelegateModal = () => {
    this.setState({ delegateFormVisible: true });
  };
  handleDelegateCancel = () => {
    console.log("handleDelegateCancel");
    this.setState({ delegateFormVisible: false });
  };
  saveDelegateFormRef = formRef => {
    console.log("saveDelegateFormRef", formRef);
    this.delegateFormRef = formRef;
  };
  handleDelegateSubmit = () => {
    console.log("handleDelegateSubmit", this.delegateFormRef.props);
    const { form } = this.delegateFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        delegateFormLoading: true
      });
      const { web3Client, userAddress } = this.props.contract;
      let contractInstance = new web3Client.eth.Contract(
        DOS_ABI,
        DOS_CONTRACT_ADDRESS
      );
      const tokenAmount = web3Client.utils.toWei(values.tokenAmount, "ether");

      let stateControll = this;
      let emitter = contractInstance.methods
        .delegate(tokenAmount, this.state.node)
        .send({ from: userAddress });
      var hashHandler = function(hash) {
        console.log("hashHandler", hash);
        stateControll.setState({
          formText: "tx : " + hash
        });
        emitter.removeListener("transactionHash", hashHandler);
      };

      var confirmationHandler = function(confirmationNumber, receipt) {
        //TODO : Update progress to user
        console.log("confirmation", confirmationNumber, receipt);
        stateControll.setState({
          formText: "Submit success in block " + receipt.blockNumber
        });
        emitter.removeListener("confirmation", confirmationHandler);
        setTimeout(() => {
          stateControll.setState({
            delegateFormVisible: false,
            formText: "",
            delegateFormLoading: false
          });
        }, 2000);
      };
      var errorHandler = function(error) {
        console.log("errorHandler", error);
        emitter.removeListener("confirmation", confirmationHandler);
        emitter.removeListener("error", errorHandler);
        stateControll.setState({
          formText: "Submit failed",
          delegateFormLoading: false
        });
        setTimeout(() => {
          stateControll.setState({
            delegateFormVisible: false,
            formText: ""
          });
        }, 2000);
      };
      emitter.on("transactionHash", hashHandler);
      emitter.on("confirmation", confirmationHandler);
      emitter.on("error", errorHandler);
    });
  };

  showUnbondModal = () => {
    this.setState({ unbondFormVisible: true });
  };
  handleUnbondCancel = () => {
    this.setState({ unbondFormVisible: false });
  };
  saveUnbondFormRef = formRef => {
    this.unbondFormformRef = formRef;
  };
  handleUnbondSubmit = () => {
    console.log("handleUnbondSubmit", this.unbondFormformRef);
    const { form } = this.unbondFormformRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        unbondFormVisible: true
      });
      const { web3Client, userAddress } = this.props.contract;
      let contractInstance = new web3Client.eth.Contract(
        DOS_ABI,
        DOS_CONTRACT_ADDRESS
      );
      const tokenAmount = web3Client.utils.toWei(values.tokenAmount, "ether");

      let stateControll = this;
      let emitter = contractInstance.methods
        .delegatorUnbond(tokenAmount, this.state.node)
        .send({ from: userAddress });
      var hashHandler = function(hash) {
        console.log("hashHandler", hash);
        stateControll.setState({
          formText: "tx : " + hash
        });
        emitter.removeListener("transactionHash", hashHandler);
      };

      var confirmationHandler = function(confirmationNumber, receipt) {
        //TODO : Update progress to user
        console.log("confirmation", confirmationNumber, receipt);
        stateControll.setState({
          formText: "Submit success in block " + receipt.blockNumber
        });
        emitter.removeListener("confirmation", confirmationHandler);
        setTimeout(() => {
          stateControll.setState({
            unbondFormVisible: false,
            formText: "",
            unbondFormLoading: false
          });
        }, 2000);
      };
      var errorHandler = function(error) {
        console.log("errorHandler", error);
        emitter.removeListener("confirmation", confirmationHandler);
        emitter.removeListener("error", errorHandler);
        stateControll.setState({
          formText: "Submit failed",
          unbondFormLoading: false
        });
        setTimeout(() => {
          stateControll.setState({
            unbondFormVisible: false,
            formText: ""
          });
        }, 2000);
      };
      emitter.on("transactionHash", hashHandler);
      emitter.on("confirmation", confirmationHandler);
      emitter.on("error", errorHandler);
    });
  };
  handleDelegatorWithdraw = () => {
    //TODO : Add loading effect and pop up a small modal to show resutl
    const { web3Client, userAddress } = this.props.contract;
    let contractInstance = new web3Client.eth.Contract(
      DOS_ABI,
      DOS_CONTRACT_ADDRESS
    );
    let emitter = contractInstance.methods
      .delegatorWithdraw(this.state.node)
      .send({ from: userAddress });
    var hashHandler = function(hash) {
      console.log("hashHandler", hash);
      emitter.removeListener("transactionHash", hashHandler);
    };

    var confirmationHandler = function(confirmationNumber, receipt) {
      //TODO : Update progress to user
      console.log("confirmation", confirmationNumber, receipt);
      emitter.removeListener("confirmation", confirmationHandler);
      emitter.removeListener("error", errorHandler);
      //TODO : Should update delegatedAmount ,pendingWithdraw and update UI
      /*
      let delegator = await contractInstance.methods
        .delegators(userAddress, nodeAddr)
        .call();
      const { delegatedAmount, pendingWithdraw } = delegator;
      let userDelegatedRewardotal = await contractInstance.methods
        .getDelegatorRewardTokens(userAddress, nodeAddr)
        .call();
      let isUserDelegatedThisNode = false;
      if (fromWei(delegatedAmount) !== 0) {
        isUserDelegatedThisNode = true;
      }
      this.setState({
        isUserDelegatedThisNode: isUserDelegatedThisNode,
        myTokenTotal:
          fromWei(delegatedAmount) + " (" + fromWei(pendingWithdraw) + ")",
        myRewardTotal: fromWei(userDelegatedRewardotal),
        nodeDetail: nodeDetail
      });*/
    };
    var errorHandler = function(error) {
      console.log("errorHandler", error);
      emitter.removeListener("confirmation", confirmationHandler);
      emitter.removeListener("error", errorHandler);
    };
    emitter.on("transactionHash", hashHandler);
    emitter.on("confirmation", confirmationHandler);
    emitter.on("error", errorHandler);
  };
  handleDelegatorClaimReward = () => {
    //TODO : Add loading effect and pop up a small modal to show resutl
    const { web3Client, userAddress } = this.props.contract;
    let contractInstance = new web3Client.eth.Contract(
      DOS_ABI,
      DOS_CONTRACT_ADDRESS
    );
    let emitter = contractInstance.methods
      .delegatorClaimReward(this.state.node)
      .send({ from: userAddress });
    var hashHandler = function(hash) {
      console.log("hashHandler", hash);
      emitter.removeListener("transactionHash", hashHandler);
    };

    var confirmationHandler = function(confirmationNumber, receipt) {
      //TODO : Update progress to user
      console.log("confirmation", confirmationNumber, receipt);
      emitter.removeListener("confirmation", confirmationHandler);
      emitter.removeListener("error", errorHandler);
      //TODO : Should update delegatedAmount ,pendingWithdraw and update UI
      /*
      let delegator = await contractInstance.methods
        .delegators(userAddress, nodeAddr)
        .call();
      const { delegatedAmount, pendingWithdraw } = delegator;
      let userDelegatedRewardotal = await contractInstance.methods
        .getDelegatorRewardTokens(userAddress, nodeAddr)
        .call();
      let isUserDelegatedThisNode = false;
      if (fromWei(delegatedAmount) !== 0) {
        isUserDelegatedThisNode = true;
      }
      this.setState({
        isUserDelegatedThisNode: isUserDelegatedThisNode,
        myTokenTotal:
          fromWei(delegatedAmount) + " (" + fromWei(pendingWithdraw) + ")",
        myRewardTotal: fromWei(userDelegatedRewardotal),
        nodeDetail: nodeDetail
      });*/
    };
    var errorHandler = function(error) {
      console.log("errorHandler", error);
      emitter.removeListener("confirmation", confirmationHandler);
      emitter.removeListener("error", errorHandler);
    };
    emitter.on("transactionHash", hashHandler);
    emitter.on("confirmation", confirmationHandler);
    emitter.on("error", errorHandler);
  };
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
      const { delegatedAmount, pendingWithdraw } = delegator;
      let userDelegatedRewardotal = await contractInstance.methods
        .getDelegatorRewardTokens(userAddress, nodeAddr)
        .call();
      console.log(" delegatedAmount ", delegatedAmount);
      let isUserDelegatedThisNode = false;
      if (
        fromWei(delegatedAmount) !== 0 ||
        fromWei(userDelegatedRewardotal) !== 0
      ) {
        isUserDelegatedThisNode = true;
      }
      this.setState({
        isUserDelegatedThisNode: isUserDelegatedThisNode,
        myTokenTotal:
          fromWei(delegatedAmount) + " (" + fromWei(pendingWithdraw) + ")",
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
              <div>
                {isUserOwnedThisNode ? (
                  <p className="info-opt">
                    <Button type="primary" shape="round" icon="solution">
                      updateNodeStaking
                    </Button>
                    <Button type="primary" shape="round" icon="solution">
                      Unregister
                    </Button>
                    <Button
                      shape="round"
                      icon="export"
                      disabled={!isUserDelegatedThisNode}
                      onClick={this.showUnbondModal}
                    >
                      Unbond
                    </Button>
                    <UnbondNode
                      wrappedComponentRef={this.saveUnbondFormRef}
                      visible={this.state.unbondFormVisible}
                      confirmLoading={this.state.unbondFormLoading}
                      onCancel={this.handleUnbondCancel}
                      onCreate={this.handleUnbondCreate}
                    />
                  </p>
                ) : (
                  <p className="info-opt">
                    <Button
                      type="primary"
                      shape="round"
                      icon="solution"
                      disabled={!isUserDelegatedThisNode}
                      onClick={this.showDelegateModal}
                    >
                      Delegate
                    </Button>
                    <DelegateNode
                      wrappedComponentRef={this.saveDelegateFormRef}
                      visible={this.state.delegateFormVisible}
                      confirmLoading={this.state.delegateFormLoading}
                      onCancel={this.handleDelegateCancel}
                      onCreate={this.handleDelegateSubmit}
                      modalText={this.state.formText}
                    ></DelegateNode>
                    <Button
                      shape="round"
                      icon="export"
                      disabled={!isUserDelegatedThisNode}
                      onClick={this.showUnbondModal}
                    >
                      Unbond
                    </Button>
                    <UnbondNode
                      wrappedComponentRef={this.saveUnbondFormRef}
                      visible={this.state.unbondFormVisible}
                      confirmLoading={this.state.unbondFormLoading}
                      onCancel={this.handleUnbondCancel}
                      onCreate={this.handleUnbondSubmit}
                      modalText={this.state.formText}
                    />
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div className="node-detail--detail">
          {isMetaMaskLogin ? (
            <div className="detail--user-info">
              <div className="user-info--delegation">
                {isUserDelegatedThisNode ? (
                  <p className="user-info--title">
                    My Delegation (Unbond amount)
                  </p>
                ) : (
                  <p className="user-info--title">My Staking Token</p>
                )}
                <p className="user-info--value">{this.state.myTokenTotal}</p>
                <Button
                  className="widthdraw-button"
                  shape="round"
                  icon="dollar"
                  onClick={this.handleDelegatorWithdraw}
                  disabled={!isUserDelegatedThisNode}
                >
                  Withdraw Token
                </Button>
              </div>
              <div className="user-info--rewards">
                <p className="user-info--title">My Rewards</p>
                <p className="user-info--value">{this.state.myRewardTotal}</p>
                <Button
                  className="widthdraw-button"
                  shape="round"
                  icon="dollar"
                  onClick={this.handleDelegatorClaimReward}
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
