import React, { Component } from "react";
import { Button, Table, message, Switch, Input, Tooltip, Icon } from "antd";
import { injectIntl, FormattedMessage } from "react-intl";
import "./style.scss";
import numeral from "numeral";
import NewNode from "./newNodeForm";
import EllipsisWrapper from "../../components/EllispisWrapper";
import identicon from "identicon.js";
import { DOS_ABI, DOS_CONTRACT_ADDRESS, BLOCK_NUMBER } from "../../util/const";
import { MESSAGE_TEXT } from "../../util/txt";
import { EmitterHandlerWrapper } from "../../util/contract-helper";
const { Column } = Table;
const { Search } = Input;
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
      pagination: {
        current: 1,
        pageSize: 10
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
      prevProps.contract.userAddress === "" && this.props.contract.userAddress;
    return { userLogined: userLogined };
  }
  componentDidUpdate(prevProps, preState, snapShot) {
    if (snapShot.userLogined) {
      this.loadNodeList("", this.state.pagination, this.props.showRelatedNodes);
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
  handleCreateNode = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        confirmLoading: true
      });
      const { web3Client, userAddress } = this.props.contract;
      let contractInstance = new web3Client.eth.Contract(
        DOS_ABI,
        DOS_CONTRACT_ADDRESS
      );
      const tokenAmount = web3Client.utils.toWei(values.tokenAmount, "ether");
      const dbAmount = values.dbAmount;
      if (web3Client.utils.isAddress(values.nodeAddr)) {
        try {
          let emitter = contractInstance.methods
            .newNode(
              values.nodeAddr,
              tokenAmount,
              dbAmount,
              values.cutRate || 0,
              values.name || ""
            )
            .send({ from: userAddress });
          this.unMountRemoveListenerCallbacks = EmitterHandlerWrapper(
            emitter,
            hash => {
              message.loading(MESSAGE_TEXT.MESSAGE_TRANSCATION_LOADING);
            },
            (confirmationNumber, receipt) => {
              message.success(MESSAGE_TEXT.MESSAGE_TRANSCATION_COMFIRM);
              this.loadNodeList(
                "",
                { current: 1, pageSize: 10 },
                this.props.showRelatedNodes
              );
            },
            error => {
              message.error(error.message.split("\n")[0]);
              this.loadNodeList(
                "",
                { current: 1, pageSize: 10 },
                this.props.showRelatedNodes
              );
            },
            { emmiterName: "CreateNode" }
          );
        } catch (e) {
          message.error(e.reason);
          this.setState({
            confirmLoading: false,
            visible: true
          });
        }
      } else {
        message.error("invalid address");
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
  handleTableChange = pagination => {
    this.loadNodeList(
      this.state.searchAddress,
      pagination,
      this.props.showRelatedNodes
    );
  };
  loadNodeList = async (
    searchAddress = "",
    { current = 1, pageSize = 10 },
    showRelatedNodes
  ) => {
    function fromWei(bn) {
      if (!bn || bn === "-") {
        return "";
      }
      return web3Client.utils.fromWei(bn.toString("10"));
    }

    this.setState({
      loading: true
    });

    const { web3Client, userAddress, isMetaMaskLogin } = this.props.contract;
    let contractInstance = new web3Client.eth.Contract(
      DOS_ABI,
      DOS_CONTRACT_ADDRESS
    );
    let nodesAddrs = [];
    let nodeList = [];

    const getLogNewNodeEventList = async userAddress => {
      return await contractInstance.getPastEvents("LogNewNode", {
        filter: { owner: userAddress },
        fromBlock: BLOCK_NUMBER,
        toBlock: "latest"
      });
    };
    const getDelegateToEventList = async senderAddress => {
      return await contractInstance.getPastEvents("DelegateTo", {
        filter: { sender: senderAddress },
        fromBlock: BLOCK_NUMBER,
        toBlock: "latest"
      });
    };
    nodesAddrs = Array.from(
      await contractInstance.methods.getNodeAddrs().call()
    );
    // search related nodes
    if (isMetaMaskLogin && showRelatedNodes) {
      console.log(`only show related nodes infos`);
      const eventList = await getLogNewNodeEventList(userAddress);
      let eventAddrs = eventList.map(event => event.returnValues.nodeAddress);
      const eventList2 = await getDelegateToEventList(userAddress);
      eventAddrs.push(...eventList2.map(event => event.returnValues.nodeAddr));
      const result = eventAddrs.filter(addr => nodesAddrs.includes(addr));
      nodesAddrs = result;
    } else {
      // search nodes
      console.log(`show all nodes infos`);
      if (userAddress) {
        //Let owne and delegate nodes show first
        const eventList = await getLogNewNodeEventList(userAddress);
        let eventAddrs = eventList
          .reverse()
          .map(event => event.returnValues.nodeAddress);
        const eventList2 = await getDelegateToEventList(userAddress);
        eventAddrs.push(
          ...eventList2.reverse().map(event => event.returnValues.nodeAddr)
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
    console.log(
      `total:${total},startIndex:${startIndex}, endIndex:${endIndex}`
    );
    for (let i = startIndex; i < endIndex; i++) {
      const nodeAddr = filtedNodes[i];
      const node = await contractInstance.methods.nodes(nodeAddr).call();
      let delegator = { myDelegator: "-", accumulatedReward: "-" };
      if (userAddress) {
        delegator = await contractInstance.methods
          .delegators(userAddress, nodeAddr)
          .call();
      }
      let uptime = await contractInstance.methods
        .getNodeUptime(nodeAddr)
        .call();
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
        isMetaMaskLogin &&
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
      nodeList.push(nodeObject);
    }
    if (this.unMount) {
      console.warn("Page[NodeList] Already Unmounted");
      return;
    }
    this.setState({
      dataList: nodeList,
      loading: false,
      pagination: {
        total,
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
    let { isMetaMaskLogin } = this.props.contract;
    let showRelatedNodes = this.props.showRelatedNodes;
    let { formatMessage: f } = this.props.intl;
    return (
      <>
        <div className="node-list--header-wrapper">
          {isMetaMaskLogin ? (
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
            {isMetaMaskLogin ? (
              <>
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
          />
          {isMetaMaskLogin ? (
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
