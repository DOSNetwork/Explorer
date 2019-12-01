import React, { Component } from "react";
import { Button, message, Tabs, Tag } from "antd";
import { DOS_ABI, DOS_CONTRACT_ADDRESS } from "../../util/const";
import DelegateNode from "./delegateNodeForm";
import UnbondNode from "./unbondNodeForm";
import UnbondOwnedNode from "./unbondOwnedNodeForm";
import UpdateStakingNode from "./updateStakingNodeForm";
import identicon from "identicon.js";
import { EllipsisString } from "../../util/util";
import "./style.scss";
import numeral from "numeral";
const { TabPane } = Tabs;
const TabbarRender = tabbarName => {
  return <div className="node-detail--tab-bar">{tabbarName}</div>;
};
const numberFormatRender = (text, record, index) => {
  return numeral(text).format("0,0");
};
export default class NodeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node: this.props.match.params.nodeId,
      nodeDetail: { node: "" },
      isUserOwnedThisNode: false,
      isUserDelegatedThisNode: false,
      myTokenTotal: 0,
      myRewardTotal: 0,
      myUnbondTotal: 0,
      loading: false,
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
  saveUpdateFormRef = formRef => {
    this.updateFormformRef = formRef;
  };
  saveUnbondFormRef = formRef => {
    this.unbondFormformRef = formRef;
  };
  saveDelegateFormRef = formRef => {
    console.log("saveDelegateFormRef", formRef);
    this.delegateFormRef = formRef;
  };
  saveUnbondOwnedNodeRef = formRef => {
    this.unbondOwnedNodeRef = formRef;
  };
  //------- withDraw unregister
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
      message.error(error.message.split('\n')[0]);
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
      message.error(error.message.split('\n')[0]);
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
      message.error(error.message.split('\n')[0]);
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
      message.error(error.message.split('\n')[0]);
    };
    emitter.on("transactionHash", hashHandler);
    emitter.on("confirmation", confirmationHandler);
    emitter.on("error", errorHandler);
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
      message.error(error.message.split('\n')[0]);
    };
    emitter.on("transactionHash", hashHandler);
    emitter.on("confirmation", confirmationHandler);
    emitter.on("error", errorHandler);
  };
  //------- delegate upgrate unbond
  handleOwnerUpgrateSubmit = e => {
    e.preventDefault();
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
        message.error(error.message.split('\n')[0]);
      };
      emitter.on("transactionHash", hashHandler);
      emitter.on("confirmation", confirmationHandler);
      emitter.on("error", errorHandler);

      this.setState({ updateFormVisible: false });
    });
  };
  handleOwnerUnbondSubmit = e => {
    e.preventDefault();
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
        message.error(error.message.split('\n')[0]);
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
  handleUserUnbondSubmit = e => {
    e.preventDefault();
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
        message.error(error.message.split('\n')[0]);
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
  handleUserDelegateSubmit = e => {
    e.preventDefault();
    console.log("handleUserDelegateSubmit", this.delegateFormRef.props);
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
        message.error(error.message.split('\n')[0]);
      };
      emitter.on("transactionHash", hashHandler);
      emitter.on("confirmation", confirmationHandler);
      emitter.on("error", errorHandler);

      this.setState({ delegateFormVisible: false, delegateFormLoading: false });
    });
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
    const nodeAddr = this.state.node;
    const nodeInstance = await contractInstance.methods.nodes(nodeAddr).call();
    let uptime = await contractInstance.methods.getNodeUptime(nodeAddr).call();
    let delegatorWithdrawAbletotal = await contractInstance.methods.delegatorWithdrawAble(nodeAddr).call();
    console.log(delegatorWithdrawAbletotal)
    let nodeWithdrawAbleTotal = await contractInstance.methods.nodeWithdrawAble(nodeAddr).call();
    // let nodeDelegators = nodeInstance.nodeDelegators;
    // if (nodeDelegators != null) {
    //   console.log(nodeAddr, " nodeDelegators ", nodeDelegators.length);
    // }
    let avatar = `data:image/png;base64,${new identicon(
      nodeAddr,
      100
    ).toString()}`;
    const {
      selfStakedAmount,
      totalOtherDelegatedAmount,
      pendingWithdrawToken,
      pendingWithdrawDB,
      rewardCut,
      description
    } = nodeInstance;
    const nodeDetail = {
      node: nodeAddr,
      avatar: avatar,
      nodeAddr: nodeAddr,
      description: description,
      selfStakedAmount: fromWei(selfStakedAmount),
      totalOtherDelegatedAmount: fromWei(totalOtherDelegatedAmount),
      rewardCut: rewardCut.toString(),
      nodeUptime: Math.round(uptime.toNumber() / (60 * 60 * 24)),
      status: nodeInstance.running
    };
    if (userAddress === "") {
      this.setState({
        nodeDetail: nodeDetail
      });
    }
    //TODO : updateGlobalRewardRate need to be called to get correct rewards

    let rewardotal = 0,
      myTokenTotal = 0,
      myUnbondTotal = 0,
      myRewardTotal = 0,
      userDelegatedRewardotal = 0,
      isUserDelegatedThisNode = false,
      isUserOwnedThisNode = false;
    console.log(userAddress, nodeInstance.ownerAddr);
    if (userAddress) {
      isUserOwnedThisNode =
        web3Client.utils.toChecksumAddress(userAddress) ===
        web3Client.utils.toChecksumAddress(nodeInstance.ownerAddr);
      if (isUserOwnedThisNode) {
        rewardotal = await contractInstance.methods
          .getNodeRewardTokens(nodeAddr)
          .call();
        myTokenTotal = fromWei(selfStakedAmount);
        myUnbondTotal =
          fromWei(pendingWithdrawToken) + fromWei(pendingWithdrawDB);
        myRewardTotal = fromWei(rewardotal);
      } else {
        let delegator = await contractInstance.methods
          .delegators(userAddress, nodeAddr)
          .call();
        userDelegatedRewardotal = await contractInstance.methods
          .getDelegatorRewardTokens(userAddress, nodeAddr)
          .call();

        let { delegatedAmount, pendingWithdraw } = delegator;
        isUserDelegatedThisNode =
          fromWei(delegatedAmount) !== 0 ||
          fromWei(userDelegatedRewardotal) !== 0;
        myTokenTotal = fromWei(delegatedAmount);
        myUnbondTotal = fromWei(pendingWithdraw);
        myRewardTotal = fromWei(userDelegatedRewardotal);
      }
    }
    this.setState({
      isUserDelegatedThisNode: isUserDelegatedThisNode,
      isUserOwnedThisNode: isUserOwnedThisNode,
      myTokenTotal: myTokenTotal,
      myUnbondTotal: myUnbondTotal,
      myRewardTotal: myRewardTotal,
      // sevenDaysTotal: fromWei(delegatorWithdrawAbletotal) + fromWei(nodeWithdrawAbleTotal),
      nodeDetail: nodeDetail
    });
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
      nodeUptime,
      status
    } = this.state.nodeDetail;

    let { isMetaMaskLogin } = this.props.contract;
    let isUserDelegatedThisNode = this.state.isUserDelegatedThisNode;
    let isUserOwnedThisNode = this.state.isUserOwnedThisNode;
    return (
      <div className="node-detail--wrapper">
        <div className="node-detail--infos">
          <div className="node-detail--info node-detail--block">
            <div className="info-avatar--wrapper">
              <img src={avatar} alt="" />
            </div>
            <div className="info-summary--wrapper">
              <div className="info-node">
                <span className="node-address">
                  {EllipsisString(node, 6, 6)}{" "}
                </span>
                {status ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>}
              </div>
              {isMetaMaskLogin ? (
                <div>
                  {isUserOwnedThisNode ? (
                    <p className="info-opt">
                      <Button
                        type="primary"
                        shape="round"
                        icon="solution"
                        onClick={this.handleUnregister}
                      >
                        Unregister
                      </Button>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          <div className="node-detail--detail node-detail--block">
            {isMetaMaskLogin ? (
              <div className="detail--user-info">
                <div className="user-info--delegation">
                  <p className="user-info--title">
                    My{" "}
                    {isUserDelegatedThisNode ? "Delegation" : "Staking Token"}
                  </p>
                  <p className="user-info--value">{numberFormatRender(this.state.myTokenTotal)}</p>
                </div>
                <div className="user-info--rewards">
                  <p className="user-info--title">Unbond</p>
                  <p className="user-info--value">{numberFormatRender(this.state.myUnbondTotal)}({numberFormatRender(this.state.sevenDaysTotal)})</p>
                  <Button
                    className="widthdraw-button"
                    shape="round"
                    size='small'
                    onClick={this.handleOwnerWithdraw}
                  >
                    Withdraw
                  </Button>
                </div>
                <div className="user-info--rewards">
                  <p className="user-info--title">My Rewards</p>
                  <p className="user-info--value">{numberFormatRender(this.state.myRewardTotal)}</p>
                  <Button
                    className="widthdraw-button"
                    shape="round"
                    size='small'
                    onClick={this.handleOwnerClaimReward}
                  >
                    Withdraw
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
              <div className="item--value">{numberFormatRender(selfStakedAmount)}</div>
            </div>
            <div className="node-detail--item">
              <div className="item--title">Total Delegated</div>
              <div className="item--value">{numberFormatRender(totalOtherDelegatedAmount)}</div>
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
        {isMetaMaskLogin ? (
          <div className="node-detail--operations node-detail--block">
            <Tabs
              className="node-detail--operation-tab"
              defaultActiveKey="1"
              size="default"
            >
              <TabPane
                tab={TabbarRender(
                  isUserDelegatedThisNode ? "Delegate" : "Upgrate"
                )}
                key="1"
              >
                <div className="tab-pannel--wrapper">
                  {isUserOwnedThisNode ? (
                    // Owner --Staking
                    <UpdateStakingNode
                      wrappedComponentRef={this.saveUpdateFormRef}
                      onSubmit={this.handleOwnerUpgrateSubmit}
                    />
                  ) : (
                      // User --Delegate
                      <DelegateNode
                        wrappedComponentRef={this.saveDelegateFormRef}
                        onSubmit={this.handleUserDelegateSubmit}
                      />
                    )}
                </div>
              </TabPane>
              <TabPane tab={TabbarRender("UnBond")} key="2">
                <div className="tab-pannel--wrapper">
                  {isUserOwnedThisNode ? (
                    // Owner --unbond
                    <UnbondOwnedNode
                      wrappedComponentRef={this.saveUnbondOwnedNodeRef}
                      onSubmit={this.handleOwnerUnbondSubmit}
                    />
                  ) : (
                      // User --unbond
                      <UnbondNode
                        wrappedComponentRef={this.saveUnbondFormRef}
                        onSubmit={this.handleUserUnbondSubmit}
                      />
                    )}
                </div>
              </TabPane>
            </Tabs>
          </div>
        ) : null}
      </div>
    );
  }
}
