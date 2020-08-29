import React, { Component } from "react";
import { Button, Table, message, Switch, Input, Tooltip, Icon } from "antd";
import { injectIntl, FormattedMessage } from "react-intl";
import "./style.scss";
import numeral from "numeral";
import NewNode from "./newNodeForm";
import EllipsisWrapper from "../../components/EllispisWrapper";
import identicon from "identicon.js";
import { EmitterHandlerWrapper } from "../../util/contract-helper";
import { MAX_ALLOWANCE } from "../../util/const";
const { Column } = Table;
const { Search } = Input;
const ps = 20; // pageSize

const nodeColumnRender = (text, record, index) => {
  let link = `/nodedetail/${record.node}`;
  return (
    <>
      <EllipsisWrapper link={link} text={text} />
    </>
  );
};

const statusColumnRender = (text, record, index) => {
  let status = record.status;
  return (
    <>
      {status ? (
        <div className="node-status__tag tag--active">
          <FormattedMessage id="Node.active" />
        </div>
      ) : (
          <div className="node-status__tag tag--inactive">
            <FormattedMessage id="Node.inactive" />
          </div>
        )}
    </>
  );
};

const nameColumnRender = (text, record) => {
  let avatar = `data:image/png;base64,${new identicon(
    record.node,
    100
  ).toString()}`;
  return (
    <div className="nodelist-name">
      <img className="nodelist-avatar" src={avatar} alt="" />
      {record.description}
    </div>
  );
};
const numberFormatRender = (text, record, index) => {
  return numeral(text).format("0,0");
};
const myDelegationFormatRender = (text, record, index) => {
  if (text === 0) {
    return "-";
  } else {
    return numberFormatRender(text);
  }
};

const tableTitleWithTipsRender = (title, tips) => {
  return (
    <div>
      {title}&nbsp;&nbsp;
      <Tooltip placement="topLeft" title={tips}>
        <Icon type="info-circle" />
      </Tooltip>
    </div>
  );
};
class NodeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      confirmLoading: false,
      visible: false,
      hideInactive: true,
      pagination: {
        current: 1,
        pageSize: ps
      },
      searchAddress: "",
      cachedNodes: [],
      formText: "",
      fields: {
        nodeAddress: {
          value: ""
        },
        dosAmount: {
          value: 0
        },
        dropBurnAmount: {
          value: 0
        },
        rewardCut: {
          value: 0
        },
        nodeDescription: {
          value: ""
        }
      }
    };
  }
  componentDidMount() {
    this.loadNodeList("", this.state.pagination, this.props.showRelatedNodes);
  }
  componentWillUnmount() {
    if (
      this.unMountRemoveListenerCallbacks &&
      typeof this.unMountRemoveListenerCallbacks === "function"
    )
      this.unMountRemoveListenerCallbacks();
    this.unMount = true;
  }
  getSnapshotBeforeUpdate(prevProps) {
    let userLogined =
      !prevProps.contract.isWalletLogin && this.props.contract.isWalletLogin;
    let isUserLogout =
      prevProps.contract.isWalletLogin && !this.props.contract.isWalletLogin;
    return { userLogined: userLogined, userLogout: isUserLogout };
  }
  componentDidUpdate(prevProps, preState, snapShot) {
    if (snapShot.userLogined) {
      setTimeout(() => {
        this.loadNodeList(
          "",
          this.state.pagination,
          this.props.showRelatedNodes
        );
      }, 0);
    }
    if (snapShot.userLogout) {
      setTimeout(() => {
        this.loadNodeList("", { current: 1, pageSize: ps }, false);
      }, 0);
    }
  }
  showModal = () => {
    this.setState({ visible: true });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  handleCreateNode = async () => {
    const {
      web3Client,
      userAddress,
      stakingContract,
      dosTokenContract,
      dbTokenContract,
      constant
    } = this.props.contract;
    const { form } = this.formRef.props;
    let { formatMessage: f } = this.props.intl;

    const allowance = await dosTokenContract.methods
      .allowance(userAddress, constant.STAKING_CONTRACT_ADDRESS)
      .call();
    const dbAllowance = await dbTokenContract.methods
      .allowance(userAddress, constant.STAKING_CONTRACT_ADDRESS)
      .call();
    this.setState({
      confirmLoading: true
    });
    form.validateFields((err, values) => {
      if (err) {
        this.setState({
          confirmLoading: false
        });
        return;
      }
      const tokenAmount = web3Client.utils.toWei(values.tokenAmount, "ether");
      const nodeAddr = values.nodeAddr;
      const dbAmount = values.dbAmount || 0;
      const cutRate = values.cutRate || 0;
      const name = values.name || "";
      let ui = this;
      const newNodeThenLoadList = function (receipt) {
        if (web3Client.utils.isAddress(nodeAddr)) {
          try {
            let emitter = stakingContract.methods
              .newNode(
                nodeAddr,
                tokenAmount,
                dbAmount,
                cutRate,
                name
              )
              .send({ from: userAddress });
            ui.unMountRemoveListenerCallbacks = EmitterHandlerWrapper(
              emitter,
              hash => {
                message.loading(
                  f({ id: "Events.Loading" }, { type: "newNode", hash: hash }),
                  0
                );
              },
              (confirmationNumber, receipt) => {
                message.destroy();
                message.success(
                  f(
                    { id: "Events.Success" },
                    { type: "newNode", blockNumber: receipt.blockNumber }
                  )
                );
                ui.loadNodeList(
                  "",
                  { current: 1, pageSize: ps },
                  ui.props.showRelatedNodes
                );
              },
              error => {
                message.error(error.message.split("\n")[0]);
                ui.loadNodeList(
                  "",
                  { current: 1, pageSize: ps },
                  ui.props.showRelatedNodes
                );
              }
            );
          } catch (e) {
            message.error(e.reason);
          }
        } else {
          message.error("invalid address");
        }
      };
      const dbApproveFunc = function (receipt) {
        try {
          let emitter = dbTokenContract.methods
            .approve(constant.STAKING_CONTRACT_ADDRESS)
            .send({ from: userAddress });
          ui.unMountRemoveListenerCallbacks = EmitterHandlerWrapper(
            emitter,
            hash => {
              message.loading(
                f({ id: "Events.Loading" }, { type: "approve", hash: hash }),
                0
              );
            },
            (confirmationNumber, receipt) => {
              message.destroy();
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
      const dbApproveThenNewNode = function (receipt) {
        try {
          let emitter = dbTokenContract.methods
            .approve(constant.STAKING_CONTRACT_ADDRESS)
            .send({ from: userAddress });
          ui.unMountRemoveListenerCallbacks = EmitterHandlerWrapper(
            emitter,
            hash => {
              message.loading(
                f({ id: "Events.Loading" }, { type: "approve", hash: hash }),
                0
              );
            },
            (confirmationNumber, receipt) => {
              message.destroy();
              message.success(
                f(
                  { id: "Events.Success" },
                  { type: "approve", blockNumber: receipt.blockNumber }
                )
              );
              newNodeThenLoadList();
            },
            error => {
              message.error(error.message.split("\n")[0]);
            }
          );
        } catch (e) {
          message.error(e.reason);
        }
      };
      const approveThenNewNode = function (receipt) {
        try {
          let emitter = dosTokenContract.methods
            .approve(constant.STAKING_CONTRACT_ADDRESS)
            .send({ from: userAddress });
          ui.unMountRemoveListenerCallbacks = EmitterHandlerWrapper(
            emitter,
            hash => {
              message.loading(
                f({ id: "Events.Loading" }, { type: "approve", hash: hash }),
                0
              );
            },
            (confirmationNumber, receipt) => {
              message.destroy();
              message.success(
                f(
                  { id: "Events.Success" },
                  { type: "approve", blockNumber: receipt.blockNumber }
                )
              );
              newNodeThenLoadList();
            },
            error => {
              message.error(error.message.split("\n")[0]);
            }
          );
        } catch (e) {
          message.error(e.reason);
        }
      };
      if (dbAmount !== 0 && dbAllowance.toString() !== MAX_ALLOWANCE) {
        if (tokenAmount !== 0 && allowance.toString() !== MAX_ALLOWANCE) {
          dbApproveFunc();
          approveThenNewNode();
        } else {
          dbApproveThenNewNode();
        }
      } else {
        if (tokenAmount !== 0 && allowance.toString() !== MAX_ALLOWANCE) {
          approveThenNewNode();
        } else {
          newNodeThenLoadList();
        }
      }
      this.setState({
        confirmLoading: false,
        visible: false
      });
    });
  };

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
  };
  onChange = checked => {
    this.props.setShowRelatedNodes(checked);
    this.loadNodeList("", {}, checked);
  };
  onHideInactiveChange = (checked) => {
    this.setState({
      hideInactive: checked
    }, () => {
      this.loadNodeList(
        this.state.searchAddress,
        {},
        this.props.showRelatedNodes
      );
    })
  }
  handleTableChange = pagination => {
    this.loadNodeList(
      this.state.searchAddress,
      pagination,
      this.props.showRelatedNodes
    );
  };
  loadNodeList = async (
    searchAddress = "",
    { current = 1, pageSize = ps },
    showRelatedNodes
  ) => {
    function fromWei(bn) {
      if (!bn || bn === "-") {
        return "";
      }
      return web3Client.utils.fromWei(bn.toString("10"));
    }
    const {
      web3Client,
      userAddress,
      isWalletLogin,
      stakingContract,
      initialBlock
    } = this.props.contract;

    const { hideInactive } = this.state
    this.setState({
      loading: true
    });
    let nodesAddrs = [];
    let nodeList = [];

    const getLogNewNodeEventList = async userAddress => {
      return await stakingContract.getPastEvents("NewNode", {
        filter: { owner: userAddress },
        fromBlock: initialBlock,
        toBlock: "latest"
      });
    };
    const getDelegateToEventList = async senderAddress => {
      return await stakingContract.getPastEvents("Delegate", {
        filter: { from: senderAddress },
        fromBlock: initialBlock,
        toBlock: "latest"
      });
    };
    nodesAddrs = Array.from(await stakingContract.methods.getNodeAddrs().call());
    // search related nodes
    if (isWalletLogin && showRelatedNodes) {
      // console.log(`only show related nodes info`);
      const eventList = await getLogNewNodeEventList(userAddress);
      let eventAddrs = eventList.map(event => event.returnValues.nodeAddress);
      const eventList2 = await getDelegateToEventList(userAddress);
      eventAddrs.push(...eventList2.map(event => event.returnValues.to));
      const result = eventAddrs.filter(addr => nodesAddrs.includes(addr));
      nodesAddrs = result;
    } else {
      // search nodes
      // console.log(`show all nodes info`);
      if (userAddress) {
        //Let owne and delegate nodes show first
        const eventList = await getLogNewNodeEventList(userAddress);
        let eventAddrs = eventList
          .reverse()
          .map(event => event.returnValues.nodeAddress);
        const eventList2 = await getDelegateToEventList(userAddress);
        eventAddrs.push(
          ...eventList2.reverse().map(event => event.returnValues.to)
        );
        const result = eventAddrs.filter(addr => nodesAddrs.includes(addr));
        nodesAddrs.unshift(...result);
      }
    }
    let filtedNodes = [];
    if (searchAddress) {
      filtedNodes = nodesAddrs.filter(
        nodeaddress => nodeaddress === searchAddress
      );
    } else {
      filtedNodes = nodesAddrs;
    }
    let noSameKeyNodes = new Set(filtedNodes);
    filtedNodes = Array.from(noSameKeyNodes);
    //做去重
    this.setState({
      cachedNodes: filtedNodes
    });
    let total = filtedNodes.length;
    let startIndex = (current - 1) * pageSize;
    let endIndex = total > current * pageSize ? current * pageSize : total;
    let now = await web3Client.eth.getBlockNumber();
    let block = await web3Client.eth.getBlock(now);

    for (let i = startIndex; i < endIndex; i++) {
      const nodeAddr = filtedNodes[i];
      let node;
      const cachedHits = localStorage.getItem(nodeAddr);
      if (cachedHits) {
        node = JSON.parse(cachedHits);
      } else {
        node = await stakingContract.methods.nodes(nodeAddr).call();
      }

      let delegator = { myDelegator: "-", accumulatedReward: "-" };
      if (userAddress) {
        const cachedHits = localStorage.getItem(nodeAddr + userAddress);
        if (cachedHits) {
          delegator = JSON.parse(cachedHits);
        } else {
          delegator = await stakingContract.methods
            .delegators(userAddress, nodeAddr)
            .call();
        }
      }
      let uptime = 0;
      if (node.running) {
        uptime = block.timestamp - node.lastStartTime;
      }

      const {
        selfStakedAmount,
        totalOtherDelegatedAmount,
        rewardCut,
        description,
        running
      } = node;
      const { delegatedAmount, accumulatedReward } = delegator;
      let totalOtherDelegatedAmountShow = fromWei(totalOtherDelegatedAmount);
      let selfStakedAmountShow = fromWei(selfStakedAmount);
      let delegatedAmountShow = fromWei(delegatedAmount);
      let accumulatedRewardShow = fromWei(accumulatedReward);
      let nodeAccumulatedReward = fromWei(node.accumulatedReward);
      if (
        isWalletLogin &&
        showRelatedNodes &&
        +selfStakedAmountShow === 0 &&
        +delegatedAmountShow === 0 &&
        +accumulatedRewardShow === 0 &&
        +nodeAccumulatedReward === 0
      ) {
        continue;
      }
      const nodeObject = {
        nameKey: `name-${nodeAddr}`,
        description: description,
        status: running,
        node: nodeAddr,
        selfStaked: selfStakedAmountShow,
        totalDelegated: totalOtherDelegatedAmountShow,
        totalRewards: nodeAccumulatedReward,
        rewardCut: rewardCut,
        uptime: Math.round(+uptime / (60 * 60 * 24)),
        myDelegation: delegatedAmountShow,
        myRewards: accumulatedRewardShow
      };
      if (!(hideInactive && !running)) {
        nodeList.push(nodeObject);
      }

      // if (hideInactive) {
      //   if (!running) {
      //     // 开启隐藏,未运行的节点不算入分页
      //     i--;
      //   } else {
      //     nodeList.push(nodeObject);
      //   }
      // } else {
      //   nodeList.push(nodeObject);
      // }
    }
    if (this.unMount) {
      console.warn("Page[NodeList] Already Unmounted");
      return;
    }
    //TODO hideInactive的时候在active节点多的时候 分页有问题
    this.setState({
      dataList: nodeList,
      loading: false,
      pagination: {
        total: hideInactive ? nodeList.length : total,
        current,
        pageSize
      }
    });
  };
  onSearchAddress = address => {
    this.setState({
      searchAddress: address
    });
    this.loadNodeList(address, {}, this.props.showRelatedNodes);
  };
  render() {
    let { isWalletLogin } = this.props.contract;
    let showRelatedNodes = this.props.showRelatedNodes;
    let { formatMessage: f } = this.props.intl;
    let { hideInactive } = this.state
    return (
      <>
        <div className="node-list--header-wrapper">
          {isWalletLogin ? (
            <div className="node-list--header-left">
              <Button type="primary" onClick={this.showModal}>
                {f({ id: "Tooltip.CreateANode" })}
              </Button>

              <NewNode
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreateNode}
                confirmLoading={this.state.confirmLoading}
                modalText={this.state.formText}
              />
            </div>
          ) : (
              <div className="node-list--header-left"></div>
            )}
          <div className="node-list--header-right">
            {isWalletLogin ? (
              <>
                <Switch
                  defaultChecked={hideInactive}
                  onChange={this.onHideInactiveChange}
                />
                &nbsp;{f({ id: "Tooltip.HideInactive" })}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Switch
                  defaultChecked={showRelatedNodes}
                  onChange={this.onChange}
                />
                &nbsp;{f({ id: "Tooltip.OnlyShowTheNodesRelatedToMe" })}
                &nbsp;&nbsp;&nbsp;&nbsp;
              </>
            ) : (
                <></>
              )}
            <Search
              placeholder={f({ id: "Tooltip.searchnodeaddress" })}
              onSearch={this.onSearchAddress}
              style={{ width: 200 }}
            />
          </div>
        </div>
        <Table
          size="small"
          rowKey={record => record.node}
          loading={this.state.loading}
          dataSource={this.state.dataList}
          pagination={{ size: "small", ...this.state.pagination }}
          rowClassName={(row, index) => {
            return index % 2 === 0 ? "row-light" : "row-dark";
          }}
          bordered={false}
          onChange={this.handleTableChange}
        >
          <Column
            title={f({ id: "Table.Column.NodeList.Name" })}
            render={nameColumnRender}
            dataIndex="nameKey"
          />
          <Column
            title={f({ id: "Table.Column.NodeList.Node" })}
            render={nodeColumnRender}
            dataIndex="node"
            key="node"
          />
          <Column
            title={f({ id: "Table.Column.NodeList.Status" })}
            render={statusColumnRender}
            dataIndex="status"
          />
          <Column
            title={tableTitleWithTipsRender(
              f({ id: "Table.Column.NodeList.SelfStaked" }),
              f({ id: "Tooltip.selfStaked" })
            )}
            render={numberFormatRender}
            dataIndex="selfStaked"
            key="selfStaked"
            sortDirections={["ascend", "descend"]}
            sorter={(a, b) =>
              a.selfStaked - b.selfStaked
            }
          />
          <Column
            title={tableTitleWithTipsRender(
              f({ id: "Table.Column.NodeList.Delegated" }),
              f({ id: "Tooltip.delegate" })
            )}
            render={numberFormatRender}
            dataIndex="totalDelegated"
            key="totalDelegated"
            sortDirections={["ascend", "descend"]}
            sorter={(a, b) =>
              a.totalDelegated - b.totalDelegated
            }
          />
          <Column
            title={tableTitleWithTipsRender(
              f({ id: "Table.Column.NodeList.RewardCut" }),
              f({ id: "Tooltip.rewartcut" })
            )}
            render={t => `${t}%`}
            dataIndex="rewardCut"
            key="rewardCut"
            sortDirections={["ascend", "descend"]}
            sorter={(a, b) =>
              a.rewardCut - b.rewardCut
            }
          />
          <Column
            title={tableTitleWithTipsRender(
              f({ id: "Table.Column.NodeList.Uptime" }),
              f({ id: "Tooltip.uptime" })
            )}
            render={t => `${t} days`}
            dataIndex="uptime"
            key="uptime"
            sortDirections={["ascend", "descend"]}
            sorter={(a, b) =>
              a.uptime - b.uptime
            }
          />
          {isWalletLogin ? (
            <Column
              title={tableTitleWithTipsRender(
                f({ id: "Table.Column.NodeList.MyDelegation" }),
                f({ id: "Tooltip.myDelegation" })
              )}
              render={myDelegationFormatRender}
              dataIndex="myDelegation"
              key="myDelegation"
              sortDirections={["ascend", "descend"]}
            />
          ) : null}
        </Table>
      </>
    );
  }
}

export default injectIntl(NodeList);
