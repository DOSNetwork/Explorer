import React, { Component } from "react";
import { Button, message, Tabs, Modal } from "antd";
import { injectIntl } from "react-intl";
import DelegateNode from "./delegateNodeForm";
import UnbondNode from "./unbondNodeForm";
import UnbondOwnedNode from "./unbondOwnedNodeForm";
import UpdateStakingNode from "./updateStakingNodeForm";
import identicon from "identicon.js";
import { EllipsisString } from "../../util/util";
import "./style.scss";
import numeral from "numeral";
import { EmitterHandlerWrapper } from "../../util/contract-helper";
import { approveString } from "../../util/const";
const { TabPane } = Tabs;
const { confirm } = Modal;
const TabbarRender = tabbarName => {
  return <div className="node-detail--tab-bar">{tabbarName}</div>;
};
const numberFormatRender = (text, record, index) => {
  return numeral(text).format("0,0");
};
const NodeDetail = class NodeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node: this.props.match.params.nodeId,
      nodeDetail: { node: "" },
      isUserOwnedThisNode: false,
      isUserDelegatedThisNode: false,
      myTokenTotal: 0,
      myRewardTotal: 0,
      withDrawalTotal: 0,
      loading: false,
      formText: ""
    };
  }
  componentDidMount() {
    const { stakingContract } = this.props.contract;
    this.stakingContract = stakingContract;
    this.unMountRemoveListenerCallbacks = [];
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
  componentWillUnmount() {
    let { unMountRemoveListenerCallbacks } = this;
    unMountRemoveListenerCallbacks.forEach(fn => {
      typeof fn === "function" && fn.call(null);
    });
    this.unMount = true;
  }
  saveUpdateFormRef = formRef => {
    this.updateFormformRef = formRef;
  };
  saveUnbondFormRef = formRef => {
    this.unbondFormformRef = formRef;
  };
  saveDelegateFormRef = formRef => {
    this.delegateFormRef = formRef;
  };
  saveUnbondOwnedNodeRef = formRef => {
    this.unbondOwnedNodeRef = formRef;
  };
  //------- withDraw unregister
  handleOwnerWithdraw = () => {
    let { formatMessage: f } = this.props.intl;
    let emitterName = "Owner Withdraw";
    const { userAddress } = this.props.contract;

    let { withDrawalTotal } = this.state;
    if (+withDrawalTotal === 0) {
      Modal.warning({
        title: emitterName,
        content: f({ id: "Form.Message.OwnerWithdraw" })
      });
      return;
    }
    let emitter = this.stakingContract.methods
      .nodeWithdraw(this.state.node)
      .send({ from: userAddress });
    // 监听并且在unmount的时候处理事件解绑
    this.handleEmmiterEvents(
      emitter,
      emitterName,
      hash => {
        message.loading(
          f({ id: "Events.Loading" }, { type: "withdraw", hash: hash })
        );
      },
      (confirmationNumber, receipt) => {
        message.success(
          f(
            { id: "Events.Success" },
            { type: "withdraw", blockNumber: receipt.blockNumber }
          )
        );
      }
    );
  };
  handleOwnerClaimReward = () => {
    let { formatMessage: f } = this.props.intl;
    let emitterName = "Owner ClaimReward";
    const { userAddress } = this.props.contract;

    let { myRewardTotal } = this.state;
    if (+myRewardTotal === 0) {
      Modal.warning({
        title: emitterName,
        content: f({ id: "Form.Message.OwnerClaimReward" })
      });
      return;
    }
    let emitter = this.stakingContract.methods
      .nodeClaimReward(this.state.node)
      .send({ from: userAddress });
    // 监听并且在unmount的时候处理事件解绑
    this.handleEmmiterEvents(
      emitter,
      emitterName,
      hash => {
        message.loading(
          f({ id: "Events.Loading" }, { type: "claimreward", hash: hash })
        );
      },
      (confirmationNumber, receipt) => {
        message.success(
          f(
            { id: "Events.Success" },
            { type: "claimreward", blockNumber: receipt.blockNumber }
          )
        );
      }
    );
  };
  handleDelegatorWithdraw = () => {
    let { formatMessage: f } = this.props.intl;
    let emitterName = "Delegator Withdraw";
    const { userAddress } = this.props.contract;

    let { withDrawalTotal } = this.state;
    if (+withDrawalTotal === 0) {
      Modal.warning({
        title: emitterName,
        content: f({ id: "Form.Message.DelegatorWithdraw" })
      });
      return;
    }
    let emitter = this.stakingContract.methods
      .delegatorWithdraw(this.state.node)
      .send({ from: userAddress });
    // 监听并且在unmount的时候处理事件解绑
    this.handleEmmiterEvents(
      emitter,
      emitterName,
      hash => {
        message.loading(
          f({ id: "Events.Loading" }, { type: "withdraw", hash: hash })
        );
      },
      (confirmationNumber, receipt) => {
        message.success(
          f(
            { id: "Events.Success" },
            { type: "withdraw", blockNumber: receipt.blockNumber }
          )
        );
      }
    );
  };
  handleDelegatorClaimReward = () => {
    let { formatMessage: f } = this.props.intl;
    let emitterName = "Delegator ClaimReward";
    const { userAddress } = this.props.contract;
    let { myRewardTotal } = this.state;
    if (+myRewardTotal === 0) {
      Modal.warning({
        title: emitterName,
        content: f({ id: "Form.Message.DelegatorClaimReward" })
      });
      return;
    }
    let emitter = this.stakingContract.methods
      .delegatorClaimReward(this.state.node)
      .send({ from: userAddress });
    // 监听并且在unmount的时候处理事件解绑
    this.handleEmmiterEvents(
      emitter,
      emitterName,
      hash => {
        message.loading(
          f({ id: "Events.Loading" }, { type: "claimreward", hash: hash })
        );
      },
      (confirmationNumber, receipt) => {
        message.success(
          f(
            { id: "Events.Success" },
            { type: "claimreward", blockNumber: receipt.blockNumber }
          )
        );
      }
    );
  };
  handleUnregister = () => {
    let { formatMessage: f } = this.props.intl;
    const { userAddress } = this.props.contract;
    confirm({
      title: "Are you sure unregister this node?",
      content: "Some descriptions here to .....",
      okText: "Sure",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        let emitter = this.stakingContract.methods
          .nodeUnregister(this.state.node)
          .send({ from: userAddress });
        // 监听并且在unmount的时候处理事件解绑
        this.handleEmmiterEvents(
          emitter,
          "User UnRegister",
          hash => {
            message.loading(
              f({ id: "Events.Loading" }, { type: "unregister", hash: hash })
            );
          },
          (confirmationNumber, receipt) => {
            message.success(
              f(
                { id: "Events.Success" },
                { type: "unregister", blockNumber: receipt.blockNumber }
              )
            );
          }
        );
      },
      onCancel() {}
    });
  };

  handleOwnerUpgrateSubmit = async e => {
    const {
      userAddress,
      dosTokenContract,
      dbTokenContract,
      constant
    } = this.props.contract;
    let { formatMessage: f } = this.props.intl;
    e.preventDefault();
    const { form } = this.updateFormformRef.props;
    const approve = await dosTokenContract.methods
      .allowance(userAddress, constant.STAKING_CONTRACT_ADDRESS)
      .call();
    const dbApprove = await dbTokenContract.methods
      .allowance(userAddress, constant.STAKING_CONTRACT_ADDRESS)
      .call();

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { web3Client, userAddress } = this.props.contract;
      let tokenAmount = 0;
      if (values.tokenAmount !== undefined) {
        tokenAmount = web3Client.utils.toWei(values.tokenAmount, "ether");
      }
      const dbAmount = values.dbAmount ? values.dbAmount : 0;
      const rewardCut = values.rewardCut;
      const nodeAddr = this.state.node;
      const ui = this;
      const updateFunc = function(receipt) {
        let emitter = ui.stakingContract.methods
          .updateNodeStaking(nodeAddr, tokenAmount, dbAmount, rewardCut)
          .send({ from: userAddress });
        // 监听并且在unmount的时候处理事件解绑
        ui.handleEmmiterEvents(
          emitter,
          "Update Node",
          hash => {
            message.loading(
              f({ id: "Events.Loading" }, { type: "update", hash: hash })
            );
          },
          (confirmationNumber, receipt) => {
            message.success(
              f(
                { id: "Events.Success" },
                { type: "update", blockNumber: receipt.blockNumber }
              )
            );
            form.resetFields();
          }
        );
      };
      const dbApproveThenUpdate = function(receipt) {
        console.log("call dbApprove then newNodeFunc");
        try {
          let emitter = dbTokenContract.methods
            .approve(constant.STAKING_CONTRACT_ADDRESS)
            .send({ from: userAddress });
          ui.handleEmmiterEvents(
            emitter,
            "dbApprove",
            hash => {
              updateFunc();
              message.loading(
                f({ id: "Events.Loading" }, { type: "approve", hash: hash })
              );
            },
            (confirmationNumber, receipt) => {
              message.success(
                f(
                  { id: "Events.Success" },
                  { type: "approve", blockNumber: receipt.blockNumber }
                )
              );
            },
            error => {
              message.error(error.message.split("\n")[0]);
            }
          );
        } catch (e) {
          message.error(e.reason);
        }
      };
      const dbApproveFunc = function(receipt) {
        console.log("call dbApprove then newNodeFunc");
        try {
          let emitter = dbTokenContract.methods
            .approve(constant.STAKING_CONTRACT_ADDRESS)
            .send({ from: userAddress });
          ui.handleEmmiterEvents(
            emitter,
            "dbApprove",
            hash => {
              message.loading(
                f({ id: "Events.Loading" }, { type: "approve", hash: hash })
              );
            },
            (confirmationNumber, receipt) => {
              message.success(
                f(
                  { id: "Events.Success" },
                  { type: "approve", blockNumber: receipt.blockNumber }
                )
              );
            },
            error => {
              message.error(error.message.split("\n")[0]);
            }
          );
        } catch (e) {
          message.error(e.reason);
        }
      };
      const approveThenUpdate = function(receipt) {
        console.log("call approveFunc then newNodeFunc");
        try {
          let emitter = dosTokenContract.methods
            .approve(constant.STAKING_CONTRACT_ADDRESS)
            .send({ from: userAddress });
          ui.handleEmmiterEvents(
            emitter,
            "Approve",
            hash => {
              updateFunc();
              message.loading(
                f({ id: "Events.Loading" }, { type: "approve", hash: hash })
              );
            },
            (confirmationNumber, receipt) => {
              message.success(
                f(
                  { id: "Events.Success" },
                  { type: "approve", blockNumber: receipt.blockNumber }
                )
              );
            },
            error => {
              message.error(error.message.split("\n")[0]);
            }
          );
        } catch (e) {
          message.error(e.reason);
        }
      };
      if (dbAmount !== 0 && dbApprove.toString() !== approveString) {
        if (tokenAmount !== 0 && approve.toString() !== approveString) {
          dbApproveFunc();
          approveThenUpdate();
        } else {
          dbApproveThenUpdate();
        }
      } else {
        if (tokenAmount !== 0 && approve.toString() !== approveString) {
          approveThenUpdate();
        } else {
          updateFunc();
        }
      }
      this.setState({ updateFormVisible: false });
    });
  };
  handleOwnerUnbondSubmit = e => {
    let { formatMessage: f } = this.props.intl;
    e.preventDefault();
    const { form } = this.unbondOwnedNodeRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { web3Client, userAddress } = this.props.contract;
      const tokenAmount = web3Client.utils.toWei(values.tokenAmount, "ether");
      const dbAmount = values.dbAmount;
      let emitter = this.stakingContract.methods
        .nodeUnbond(tokenAmount, dbAmount, this.state.node)
        .send({ from: userAddress });

      // 监听并且在unmount的时候处理事件解绑
      this.handleEmmiterEvents(
        emitter,
        "Owner Unbond",
        hash => {
          message.loading(
            f({ id: "Events.Loading" }, { type: "unbond", hash: hash })
          );
        },
        (confirmationNumber, receipt) => {
          message.success(
            f(
              { id: "Events.Success" },
              { type: "unbond", blockNumber: receipt.blockNumber }
            )
          );
          form.resetFields();
        }
      );

      this.setState({
        unbondOwnedNodeLoading: false,
        unbondOwnedNodeVisible: false
      });
    });
  };
  handleUserUnbondSubmit = e => {
    let { formatMessage: f } = this.props.intl;
    e.preventDefault();
    const { form } = this.unbondFormformRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { web3Client, userAddress } = this.props.contract;
      const tokenAmount = web3Client.utils.toWei(values.tokenAmount, "ether");

      let emitter = this.stakingContract.methods
        .delegatorUnbond(tokenAmount, this.state.node)
        .send({ from: userAddress });

      // 监听并且在unmount的时候处理事件解绑
      this.handleEmmiterEvents(
        emitter,
        "Delegator Unbond",
        hash => {
          message.loading(
            f({ id: "Events.Loading" }, { type: "unbond", hash: hash })
          );
        },
        (confirmationNumber, receipt) => {
          message.success(
            f(
              { id: "Events.Success" },
              { type: "unbond", blockNumber: receipt.blockNumber }
            )
          );
          form.resetFields();
        }
      );
      this.setState({
        formText: "",
        unbondFormLoading: false,
        unbondFormVisible: false
      });
    });
  };
  handleUserDelegateSubmit = async e => {
    const {
      web3Client,
      userAddress,
      stakingContract,
      dosTokenContract,
      constant
    } = this.props.contract;
    let { formatMessage: f } = this.props.intl;
    e.preventDefault();
    const { form } = this.delegateFormRef.props;
    const approve = await dosTokenContract.methods
      .allowance(userAddress, constant.STAKING_CONTRACT_ADDRESS)
      .call();
    this.setState({
      delegateFormLoading: true
    });
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const tokenAmount = web3Client.utils.toWei(values.tokenAmount, "ether");
      const nodeAddr = this.state.node;
      let ui = this;

      const delegateFunc = function(receipt) {
        try {
          let emitter = stakingContract.methods
            .delegate(tokenAmount, nodeAddr)
            .send({ from: userAddress });
          // 监听并且在unmount的时候处理事件解绑
          ui.handleEmmiterEvents(
            emitter,
            "User Delegate",
            hash => {
              message.loading(
                f({ id: "Events.Loading" }, { type: "delegate", hash: hash })
              );
            },
            (confirmationNumber, receipt) => {
              message.success(
                f(
                  { id: "Events.Success" },
                  { type: "delegate", blockNumber: receipt.blockNumber }
                )
              );
              form.resetFields();
            },
            error => {
              message.error(error.message.split("\n")[0]);
            }
          );
        } catch (e) {
          console.log("e3 err ", e);
          message.error(e.reason);
        }
      };
      if (approve.toString() !== approveString) {
        try {
          let emitter = dosTokenContract.methods
            .approve(constant.STAKING_CONTRACT_ADDRESS)
            .send({ from: userAddress });
          ui.handleEmmiterEvents(
            emitter,
            "User Approve",
            hash => {
              delegateFunc();
              message.loading(
                f({ id: "Events.Loading" }, { type: "approve", hash: hash })
              );
            },
            (confirmationNumber, receipt) => {
              message.success(
                f(
                  { id: "Events.Success" },
                  { type: "approve", blockNumber: receipt.blockNumber }
                )
              );
            },
            error => {
              message.error(error.message.split("\n")[0]);
            }
          );
        } catch (e) {
          message.error(e.reason);
        }
      } else {
        delegateFunc();
      }

      this.setState({ delegateFormVisible: false, delegateFormLoading: false });
    });
  };
  handleEmmiterEvents = (
    emitter,
    emitterName,
    hashCallback,
    successCallback
  ) => {
    let pageInstance = this;
    this.unMountRemoveListenerCallbacks.push(
      EmitterHandlerWrapper(
        emitter,
        hash => {
          hashCallback.call(this, hash);
        },
        (confirmationNumber, receipt) => {
          successCallback.call(this, confirmationNumber, receipt);
          if (!this.unMount) {
            pageInstance && pageInstance.getNodeDetail();
          }
        },
        error => {
          message.error(error.message.split("\n")[0]);
        },
        { emmiterName: emitterName }
      )
    );
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
    const { web3Client, userAddress, stakingContract } = this.props.contract;

    const nodeAddr = this.state.node;
    const nodeInstance = await stakingContract.methods.nodes(nodeAddr).call();
    let uptime = await stakingContract.methods.getNodeUptime(nodeAddr).call();
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
      description,
      stakedDB
    } = nodeInstance;
    const nodeDetail = {
      node: nodeAddr,
      avatar: avatar,
      nodeAddr: nodeAddr,
      description: description,
      selfStakedAmount: fromWei(selfStakedAmount),
      totalOtherDelegatedAmount: fromWei(totalOtherDelegatedAmount),
      rewardCut: rewardCut.toString(),
      nodeUptime: Math.round(+uptime / (60 * 60 * 24)),
      status: nodeInstance.running
    };
    if (userAddress === "") {
      this.setState({
        nodeDetail: nodeDetail
      });
    }

    let rewardotal = 0,
      myTokenTotal = 0,
      withDrawalTotal = 0,
      withDrawalFrozen = 0,
      myRewardTotal = 0,
      userDelegatedRewardTotal = 0,
      withDrawalDropBurn = 0,
      withDrawalDropBurnFrozen = 0,
      isUserDelegatedThisNode = false,
      isUserOwnedThisNode = false;
    if (userAddress) {
      isUserOwnedThisNode =
        web3Client.utils.toChecksumAddress(userAddress) ===
        web3Client.utils.toChecksumAddress(nodeInstance.ownerAddr);
      if (isUserOwnedThisNode) {
        const nodeWithdrawableTotal = await stakingContract.methods
          .nodeWithdrawable(nodeInstance.ownerAddr, nodeAddr)
          .call();
        rewardotal = await stakingContract.methods
          .getNodeRewardTokensRT(nodeAddr)
          .call();
        myTokenTotal = fromWei(selfStakedAmount);
        withDrawalTotal =
          Math.round(fromWei(nodeWithdrawableTotal[0]) * 100) / 100;
        let tempBn = new web3Client.utils.toBN(pendingWithdrawToken);
        tempBn = tempBn.sub(
          new web3Client.utils.toBN(nodeWithdrawableTotal[0])
        );
        withDrawalFrozen = Math.round(fromWei(tempBn.toString()) * 100) / 100;
        withDrawalDropBurn = nodeWithdrawableTotal[1];
        withDrawalDropBurnFrozen = pendingWithdrawDB - withDrawalDropBurn;

        myRewardTotal = fromWei(rewardotal);
      } else {
        const delegatorWithdrawableTotal = await stakingContract.methods
          .delegatorWithdrawable(userAddress, nodeAddr)
          .call();
        let delegator = await stakingContract.methods
          .delegators(userAddress, nodeAddr)
          .call();
        userDelegatedRewardTotal = await stakingContract.methods
          .getDelegatorRewardTokensRT(userAddress, nodeAddr)
          .call();

        let { delegatedAmount, pendingWithdraw } = delegator;
        let tempBn = new web3Client.utils.toBN(pendingWithdraw);
        tempBn = tempBn.sub(
          new web3Client.utils.toBN(delegatorWithdrawableTotal)
        );
        withDrawalFrozen = Math.round(fromWei(tempBn.toString()) * 100) / 100;
        withDrawalTotal =
          Math.round(fromWei(delegatorWithdrawableTotal) * 100) / 100;
        myTokenTotal = fromWei(delegatedAmount);
        myRewardTotal = fromWei(userDelegatedRewardTotal);
        isUserDelegatedThisNode =
          fromWei(delegatedAmount) !== 0 ||
          fromWei(pendingWithdraw) !== 0 ||
          fromWei(userDelegatedRewardTotal) !== 0;
      }
    }
    this.setState({
      isUserDelegatedThisNode: isUserDelegatedThisNode,
      isUserOwnedThisNode: isUserOwnedThisNode,
      myTokenTotal: myTokenTotal,
      withDrawalTotal: withDrawalTotal,
      myRewardTotal: myRewardTotal,
      withDrawalFrozen: withDrawalFrozen,
      dropBurnToken: stakedDB,
      withDrawalDropBurn: withDrawalDropBurn,
      withDrawalDropBurnFrozen: withDrawalDropBurnFrozen,
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
    let { formatMessage: f } = this.props.intl;
    let { isWalletLogin } = this.props.contract;
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
                {status ? (
                  <div className="node-status__tag tag--active">
                    {f({ id: "Node.active" })}
                  </div>
                ) : (
                  <div className="node-status__tag tag--inactive">
                    {f({ id: "Node.inactive" })}
                  </div>
                )}
              </div>
              {isWalletLogin && isUserOwnedThisNode ? (
                <span
                  className="unregister-button"
                  onClick={this.handleUnregister}
                >
                  {" "}
                  Unregister
                </span>
              ) : null}
            </div>
          </div>
          <div className="node-detail--detail node-detail--block">
            {isWalletLogin ? (
              <div className="detail--user-info">
                <div className="user-info--delegation">
                  <p className="user-info--title">
                    {isUserDelegatedThisNode
                      ? f({ id: "Tooltip.NodeDetail.MyDelegation" })
                      : f({ id: "Tooltip.NodeDetail.MyStaking" })}
                  </p>
                  <p className="user-info--value">
                    {numberFormatRender(this.state.myTokenTotal)}
                  </p>
                  {+this.state.dropBurnToken >= "0" && isUserOwnedThisNode ? (
                    <>
                      <p className="user-info--title">
                        {f({ id: "Tooltip.NodeDetail.DropBurnToken" })}
                      </p>
                      <p className="user-info--value">
                        {numberFormatRender(this.state.dropBurnToken)}
                      </p>
                    </>
                  ) : null}
                </div>
                <div className="user-info--rewards">
                  <p className="user-info--title">
                    {f({ id: "Tooltip.NodeDetail.WithdrawalFrozen" })}
                  </p>
                  <p className="user-info--value">
                    {numberFormatRender(this.state.withDrawalTotal)}
                    <span className="value--frozen">
                      {" "}
                      / {numberFormatRender(this.state.withDrawalFrozen)}
                    </span>
                  </p>
                  {(+this.state.withDrawalDropBurn >= "0" ||
                    +this.state.withDrawalDropBurnFrozen >= "0") &&
                  isUserOwnedThisNode ? (
                    <>
                      <p className="user-info--title">
                        {f({
                          id: "Tooltip.NodeDetail.WithdrawalDropBurnFrozen"
                        })}
                      </p>
                      <p className="user-info--value">
                        {numberFormatRender(this.state.withDrawalDropBurn)}
                        <span className="value--frozen">
                          {" "}
                          /
                          {numberFormatRender(
                            this.state.withDrawalDropBurnFrozen
                          )}
                        </span>
                      </p>
                    </>
                  ) : null}
                  {isUserDelegatedThisNode ? (
                    <Button
                      className="widthdraw-button"
                      shape="round"
                      size="small"
                      onClick={this.handleDelegatorWithdraw}
                    >
                      {f({ id: "Tooltip.NodeDetail.Withdraw" })}
                    </Button>
                  ) : (
                    <Button
                      className="widthdraw-button"
                      shape="round"
                      size="small"
                      onClick={this.handleOwnerWithdraw}
                    >
                      {f({ id: "Tooltip.NodeDetail.Withdraw" })}
                    </Button>
                  )}
                </div>
                <div className="user-info--rewards">
                  <p className="user-info--title">
                    {" "}
                    {f({ id: "Tooltip.NodeDetail.MyRewards" })}
                  </p>
                  <p className="user-info--value">
                    {numberFormatRender(this.state.myRewardTotal)}
                  </p>
                  {isUserDelegatedThisNode ? (
                    <Button
                      className="widthdraw-button"
                      shape="round"
                      size="small"
                      onClick={this.handleDelegatorClaimReward}
                    >
                      {f({ id: "Tooltip.NodeDetail.Claim" })}
                    </Button>
                  ) : (
                    <Button
                      className="widthdraw-button"
                      shape="round"
                      size="small"
                      onClick={this.handleOwnerClaimReward}
                    >
                      {f({ id: "Tooltip.NodeDetail.Claim" })}
                    </Button>
                  )}
                </div>
              </div>
            ) : null}
            <div className="node-detail--item">
              <div className="item--title">
                {" "}
                {f({ id: "Tooltip.NodeDetail.NodeAddress" })}
              </div>
              <div className="item--value">{nodeAddr}</div>
            </div>
            <div className="node-detail--item">
              <div className="item--title">
                {" "}
                {f({ id: "Tooltip.NodeDetail.NodeDescription" })}
              </div>
              <div className="item--value">{description}</div>
            </div>
            <div className="node-detail--item">
              <div className="item--title">
                {" "}
                {f({ id: "Tooltip.NodeDetail.NodeSelt-Staked" })}
              </div>
              <div className="item--value">
                {numberFormatRender(selfStakedAmount)}
              </div>
            </div>
            <div className="node-detail--item">
              <div className="item--title">
                {" "}
                {f({ id: "Tooltip.NodeDetail.TotalDelegated" })}
              </div>
              <div className="item--value">
                {numberFormatRender(totalOtherDelegatedAmount)}
              </div>
            </div>
            <div className="node-detail--item">
              <div className="item--title">
                {" "}
                {f({ id: "Tooltip.NodeDetail.RewardCut" })}
              </div>
              <div className="item--value">{rewardCut}%</div>
            </div>
            <div className="node-detail--item">
              <div className="item--title">
                {" "}
                {f({ id: "Tooltip.NodeDetail.Uptime" })}
              </div>
              <div className="item--value">
                {nodeUptime} {f({ id: "Tooltip.NodeDetail.Days" })}
              </div>
            </div>
          </div>
        </div>
        {isWalletLogin ? (
          <div className="node-detail--operations node-detail--block">
            <Tabs
              className="node-detail--operation-tab"
              defaultActiveKey="1"
              size="default"
            >
              <TabPane
                tab={TabbarRender(
                  isUserDelegatedThisNode
                    ? f({ id: "Tooltip.NodeDetail.Delegate" })
                    : f({ id: "Tooltip.NodeDetail.Update" })
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
              <TabPane
                tab={TabbarRender(f({ id: "Tooltip.NodeDetail.Unbond" }))}
                key="2"
              >
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
};

export default injectIntl(NodeDetail);
