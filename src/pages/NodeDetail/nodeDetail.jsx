import React, { Component } from "react";
import { Button, message } from "antd";
import { DOS_ABI, DOS_CONTRACT_ADDRESS } from "../../util/const";
import DelegateNode from "./delegateNodeForm";
import UnbondNode from "./unbondNodeForm";
import UnbondOwnedNode from "./unbondOwnedNodeForm";
import UpdateStakingNode from "./updateStakingNodeForm";
import identicon from 'identicon.js'
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
      updateFormVisible: false,
      updateFormLoading: false,
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

      let emitter = contractInstance.methods
        .delegate(tokenAmount, this.state.node)
        .send({ from: userAddress });
      // let nodeDetail = this;
      let hide;
      var hashHandler = function (hash) {
        emitter.removeListener("transactionHash", hashHandler);
        hide = message.loading("Delegate: wait for confirmatin : " + hash, 0);
      };

      var confirmationHandler = function (confirmationNumber, receipt) {
        hide();
        emitter.removeListener("confirmation", confirmationHandler);
        message.success(
          "Delegate: success (confirmed block " + receipt.blockNumber + ")"
        );
        //TODO:If user still in nodetail page then page should update node detail
        //nodeDetail.getNodeDetail();
      };
      var errorHandler = function (error) {
        emitter.removeListener("confirmation", confirmationHandler);
        emitter.removeListener("error", errorHandler);
        message.error(error.message);
      };
      emitter.on("transactionHash", hashHandler);
      emitter.on("confirmation", confirmationHandler);
      emitter.on("error", errorHandler);

      this.setState({ delegateFormVisible: false, delegateFormLoading: false });
    });
  };
  showUpdateModal = () => {
    this.setState({ updateFormVisible: true });
  };
  handleUpdateCancel = () => {
    this.setState({ updateFormVisible: false });
  };
  saveUpdateFormRef = formRef => {
    this.updateFormformRef = formRef;
  };
  handleUpdateCreate = () => {
    const { form } = this.updateFormformRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { web3Client, userAddress } = this.props.contract;
      let contractInstance = new web3Client.eth.Contract(
        DOS_ABI,
        DOS_CONTRACT_ADDRESS
      );
      const tokenAmount = web3Client.utils.toWei(values.tokenAmount, "ether");
      const dbAmount = web3Client.utils.toWei(values.dbAmount, "ether");
      const rewardCut = values.rewardCut;
      let emitter = contractInstance.methods
        .updateNodeStaking(this.state.node, tokenAmount, dbAmount, rewardCut)
        .send({ from: userAddress });
      let hide;
      var hashHandler = function (hash) {
        emitter.removeListener("transactionHash", hashHandler);
        hide = message.loading("Unbond: wait for confirmatin : " + hash, 0);
      };

      var confirmationHandler = function (confirmationNumber, receipt) {
        hide();
        emitter.removeListener("confirmation", confirmationHandler);
        message.success(
          "Unbond: success (confirmed block " + receipt.blockNumber + ")"
        );
        //TODO:If user still in nodetail page then page should update node detail
      };
      var errorHandler = function (error) {
        emitter.removeListener("confirmation", confirmationHandler);
        emitter.removeListener("error", errorHandler);
        message.error(error.message);
      };
      emitter.on("transactionHash", hashHandler);
      emitter.on("confirmation", confirmationHandler);
      emitter.on("error", errorHandler);

      this.setState({ updateFormVisible: false });
    });
  };
  showUnbondOwnedNodeModal = () => {
    this.setState({ unbondOwnedNodeVisible: true });
  };
  handleUnbondOwnedNodeCancel = () => {
    this.setState({ unbondOwnedNodeVisible: false });
  };
  saveUnbondOwnedNodeRef = formRef => {
    this.unbondOwnedNodeRef = formRef;
  };
  handleUnbondOwnedNodeSubmit = () => {
    const { form } = this.unbondOwnedNodeRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { web3Client, userAddress } = this.props.contract;
      let contractInstance = new web3Client.eth.Contract(
        DOS_ABI,
        DOS_CONTRACT_ADDRESS
      );
      console.log(values.tokenAmount, values.dbAmount);
      const tokenAmount = web3Client.utils.toWei(values.tokenAmount, "ether");
      const dbAmount = web3Client.utils.toWei(values.dbAmount, "ether");
      let emitter = contractInstance.methods
        .nodeUnbond(tokenAmount, dbAmount, this.state.node)
        .send({ from: userAddress });
      let hide;
      var hashHandler = function (hash) {
        emitter.removeListener("transactionHash", hashHandler);
        hide = message.loading("Unbond: wait for confirmatin : " + hash, 0);
      };

      var confirmationHandler = function (confirmationNumber, receipt) {
        hide();
        emitter.removeListener("confirmation", confirmationHandler);
        message.success(
          "Unbond: success (confirmed block " + receipt.blockNumber + ")"
        );
        //TODO:If user still in nodetail page then page should update node detail
      };
      var errorHandler = function (error) {
        emitter.removeListener("confirmation", confirmationHandler);
        emitter.removeListener("error", errorHandler);
        message.error(error.message);
      };
      emitter.on("transactionHash", hashHandler);
      emitter.on("confirmation", confirmationHandler);
      emitter.on("error", errorHandler);
      this.setState({
        unbondOwnedNodeLoading: false,
        unbondOwnedNodeVisible: false
      });
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
    const { form } = this.unbondFormformRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { web3Client, userAddress } = this.props.contract;
      let contractInstance = new web3Client.eth.Contract(
        DOS_ABI,
        DOS_CONTRACT_ADDRESS
      );
      const tokenAmount = web3Client.utils.toWei(values.tokenAmount, "ether");

      let emitter = contractInstance.methods
        .delegatorUnbond(tokenAmount, this.state.node)
        .send({ from: userAddress });
      let hide;
      var hashHandler = function (hash) {
        emitter.removeListener("transactionHash", hashHandler);
        hide = message.loading("Unbond: wait for confirmatin : " + hash, 0);
      };

      var confirmationHandler = function (confirmationNumber, receipt) {
        hide();
        emitter.removeListener("confirmation", confirmationHandler);
        message.success(
          "Unbond: success (confirmed block " + receipt.blockNumber + ")"
        );
        //TODO:If user still in nodetail page then page should update node detail
      };
      var errorHandler = function (error) {
        emitter.removeListener("confirmation", confirmationHandler);
        emitter.removeListener("error", errorHandler);
        message.error(error.message);
      };
      emitter.on("transactionHash", hashHandler);
      emitter.on("confirmation", confirmationHandler);
      emitter.on("error", errorHandler);
      this.setState({
        formText: "",
        unbondFormLoading: false,
        unbondFormVisible: false
      });
    });
  };
  handleUnregister = () => {
    //TODO : Add loading effect and pop up a small modal to show resutl
    const { web3Client, userAddress } = this.props.contract;
    let contractInstance = new web3Client.eth.Contract(
      DOS_ABI,
      DOS_CONTRACT_ADDRESS
    );
    let emitter = contractInstance.methods
      .nodeUnregister(this.state.node)
      .send({ from: userAddress });
    let hide;
    var hashHandler = function (hash) {
      emitter.removeListener("transactionHash", hashHandler);
      hide = message.loading("Unregister: wait for confirmatin : " + hash, 0);
    };
    var confirmationHandler = function (confirmationNumber, receipt) {
      hide();
      emitter.removeListener("confirmation", confirmationHandler);
      message.success(
        "Unregister: success (confirmed block " + receipt.blockNumber + ")"
      );
      //TODO:If user still in nodetail page then page should update node detail
    };
    var errorHandler = function (error) {
      emitter.removeListener("confirmation", confirmationHandler);
      emitter.removeListener("error", errorHandler);
      message.error(error.message);
    };
    emitter.on("transactionHash", hashHandler);
    emitter.on("confirmation", confirmationHandler);
    emitter.on("error", errorHandler);
  };
  handleOwnerWithdraw = () => {
    //TODO : Add loading effect and pop up a small modal to show resutl
    const { web3Client, userAddress } = this.props.contract;
    let contractInstance = new web3Client.eth.Contract(
      DOS_ABI,
      DOS_CONTRACT_ADDRESS
    );
    let emitter = contractInstance.methods
      .nodeWithdraw(this.state.node)
      .send({ from: userAddress });
    let hide;
    var hashHandler = function (hash) {
      emitter.removeListener("transactionHash", hashHandler);
      hide = message.loading("Withdraw: wait for confirmatin : " + hash, 0);
    };
    var confirmationHandler = function (confirmationNumber, receipt) {
      hide();
      emitter.removeListener("confirmation", confirmationHandler);
      message.success(
        "Withdraw: success (confirmed block " + receipt.blockNumber + ")"
      );
      //TODO:If user still in nodetail page then page should update node detail
    };
    var errorHandler = function (error) {
      emitter.removeListener("confirmation", confirmationHandler);
      emitter.removeListener("error", errorHandler);
      message.error(error.message);
    };
    emitter.on("transactionHash", hashHandler);
    emitter.on("confirmation", confirmationHandler);
    emitter.on("error", errorHandler);
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
    let hide;
    var hashHandler = function (hash) {
      emitter.removeListener("transactionHash", hashHandler);
      hide = message.loading("Withdraw: wait for confirmatin : " + hash, 0);
    };
    var confirmationHandler = function (confirmationNumber, receipt) {
      hide();
      emitter.removeListener("confirmation", confirmationHandler);
      message.success(
        "Withdraw: success (confirmed block " + receipt.blockNumber + ")"
      );
      //TODO:If user still in nodetail page then page should update node detail
    };
    var errorHandler = function (error) {
      emitter.removeListener("confirmation", confirmationHandler);
      emitter.removeListener("error", errorHandler);
      message.error(error.message);
    };
    emitter.on("transactionHash", hashHandler);
    emitter.on("confirmation", confirmationHandler);
    emitter.on("error", errorHandler);
  };
  handleOwnerClaimReward = () => {
    //TODO : Add loading effect and pop up a small modal to show resutl
    const { web3Client, userAddress } = this.props.contract;
    let contractInstance = new web3Client.eth.Contract(
      DOS_ABI,
      DOS_CONTRACT_ADDRESS
    );
    let emitter = contractInstance.methods
      .nodeClaimReward(this.state.node)
      .send({ from: userAddress });
    let hide;
    var hashHandler = function (hash) {
      emitter.removeListener("transactionHash", hashHandler);
      hide = message.loading("ClaimReward: wait for confirmatin : " + hash, 0);
    };
    var confirmationHandler = function (confirmationNumber, receipt) {
      hide();
      emitter.removeListener("confirmation", confirmationHandler);
      message.success(
        "ClaimReward: success (confirmed block " + receipt.blockNumber + ")"
      );
      //TODO:If user still in nodetail page then page should update node detail
    };
    var errorHandler = function (error) {
      emitter.removeListener("confirmation", confirmationHandler);
      emitter.removeListener("error", errorHandler);
      message.error(error.message);
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
    let hide;
    var hashHandler = function (hash) {
      emitter.removeListener("transactionHash", hashHandler);
      hide = message.loading("ClaimReward: wait for confirmatin : " + hash, 0);
    };
    var confirmationHandler = function (confirmationNumber, receipt) {
      hide();
      emitter.removeListener("confirmation", confirmationHandler);
      message.success(
        "ClaimReward: success (confirmed block " + receipt.blockNumber + ")"
      );
      //TODO:If user still in nodetail page then page should update node detail
    };
    var errorHandler = function (error) {
      emitter.removeListener("confirmation", confirmationHandler);
      emitter.removeListener("error", errorHandler);
      message.error(error.message);
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
      pendingWithdrawToken,
      pendingWithdrawDB,
      rewardCut,
      description
    } = nodeInstance;
    let nodeDelegators = nodeInstance.nodeDelegators;
    if (nodeDelegators != null) {
      console.log(nodeAddr, " nodeDelegators ", nodeDelegators.length);
    }
    var avatar = `data:image/png;base64,${new identicon(nodeAddr, 100).toString()}`;
    const nodeDetail = {
      node: "",
      avatar: avatar,
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
        myTokenTotal:
          fromWei(selfStakedAmount) +
          " (" +
          fromWei(pendingWithdrawToken) +
          fromWei(pendingWithdrawDB) +
          ")",
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
                    <Button
                      type="primary"
                      shape="round"
                      icon="solution"
                      onClick={this.showUpdateModal}
                    >
                      updateNodeStaking
                    </Button>
                    <UpdateStakingNode
                      wrappedComponentRef={this.saveUpdateFormRef}
                      visible={this.state.updateFormVisible}
                      confirmLoading={this.state.updateFormLoading}
                      onCancel={this.handleUpdateCancel}
                      onCreate={this.handleUpdateCreate}
                    />
                    <Button
                      type="primary"
                      shape="round"
                      icon="solution"
                      onClick={this.handleUnregister}
                    >
                      Unregister
                    </Button>
                    <Button
                      shape="round"
                      icon="export"
                      onClick={this.showUnbondOwnedNodeModal}
                    >
                      Unbond
                    </Button>
                    <UnbondOwnedNode
                      wrappedComponentRef={this.saveUnbondOwnedNodeRef}
                      visible={this.state.unbondOwnedNodeVisible}
                      confirmLoading={this.state.unbondOwnedNodeLoading}
                      onCancel={this.handleUnbondOwnedNodeCancel}
                      onCreate={this.handleUnbondOwnedNodeSubmit}
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
                    <p className="user-info--title">
                      My Staking Token (Unbond amount)
                  </p>
                  )}
                <p className="user-info--value">{this.state.myTokenTotal}</p>
                {isUserOwnedThisNode ? (
                  <Button
                    className="widthdraw-button"
                    shape="round"
                    icon="dollar"
                    onClick={this.handleOwnerWithdraw}
                  >
                    Withdraw Token
                  </Button>
                ) : (
                    <Button
                      className="widthdraw-button"
                      shape="round"
                      icon="dollar"
                      onClick={this.handleDelegatorWithdraw}
                      disabled={!isUserDelegatedThisNode}
                    >
                      Withdraw Token
                  </Button>
                  )}
              </div>
              <div className="user-info--rewards">
                <p className="user-info--title">My Rewards</p>
                <p className="user-info--value">{this.state.myRewardTotal}</p>
                {isUserOwnedThisNode ? (
                  <Button
                    className="widthdraw-button"
                    shape="round"
                    icon="dollar"
                    onClick={this.handleOwnerClaimReward}
                  >
                    Withdraw Reward
                  </Button>
                ) : (
                    <Button
                      className="widthdraw-button"
                      shape="round"
                      icon="dollar"
                      onClick={this.handleDelegatorClaimReward}
                      disabled={!isUserDelegatedThisNode}
                    >
                      Withdraw Reward
                  </Button>
                  )}
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
