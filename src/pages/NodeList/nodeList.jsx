import React, { Component } from "react";
import { Button, Table, message, Switch, Input, Tooltip, Icon } from "antd";
import "./style.scss";
import numeral from "numeral";
import NewNode from "./newNodeForm";
import EllipsisWrapper from '../../components/EllispisWrapper'
import identicon from 'identicon.js'
import { DOS_ABI, DOS_CONTRACT_ADDRESS, BLOCK_NUMBER } from "../../util/const";
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

const nameColumnRender = (text, record) => {
  let avatar = `data:image/png;base64,${new identicon(record.node, 100).toString()}`;
  return (
    <img className='nodelist-avatar' src={avatar} alt="" />
  )
}
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
  return (<div>{title}&nbsp;&nbsp;
    <Tooltip placement="topLeft" title={tips}>
      <Icon type="info-circle" />
    </Tooltip>
  </div>)
}
export default class NodeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      confirmLoading: false,
      visible: false,
      showRelatedNodes: false,
      pagination: {
        current: 1,
        pageSize: 10
      },
      searchAddress: '',
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
    this.loadNodeList('', this.state.pagination);
  }
  getSnapshotBeforeUpdate(prevProps) {
    let userLogined =
      prevProps.contract.userAddress === "" && this.props.contract.userAddress;
    return { userLogined: userLogined };
  }
  componentDidUpdate(prevProps, preState, snapShot) {
    if (snapShot.userLogined) {
      this.loadNodeList('', this.state.pagination);
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
  handleCreate = () => {
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

      let emitter = contractInstance.methods
        .newNode(values.nodeAddr, tokenAmount, 0, values.cutRate, "test")
        .send({ from: userAddress });
      let hide;
      var hashHandler = function (hash) {
        emitter.removeListener("transactionHash", hashHandler);
        hide = message.loading("It will take some time to confirm the transaction.", 3000);
      };

      var confirmationHandler = function (confirmationNumber, receipt) {
        //TODO : Update progress to user
        hide();
        emitter.removeListener("confirmation", confirmationHandler);
        message.success(
          "Transaction Confirmed."
        );
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
    this.props.setShowRelatedNodes(checked)
    this.loadNodeList('', {});
  };
  handleTableChange = (pagination) => {
    this.loadNodeList(this.state.searchAddress, pagination)
  }
  loadNodeList = async (searchAddress = '', { current = 1, pageSize = 10 }) => {
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

    const getLogNewNodeEventList = async (userAddress) => {
      return await contractInstance.getPastEvents(
        "LogNewNode",
        {
          filter: { owner: userAddress },
          fromBlock: BLOCK_NUMBER,
          toBlock: "latest"
        }
      );
    }
    const getDelegateToEventList = async (senderAddress) => {
      return await contractInstance.getPastEvents(
        "DelegateTo",
        {
          filter: { sender: senderAddress },
          fromBlock: BLOCK_NUMBER,
          toBlock: "latest"
        }
      );
    }
    // search related nodes
    if (isMetaMaskLogin && this.props.showRelatedNodes) {
      const eventList = await getLogNewNodeEventList(userAddress)
      nodesAddrs = eventList.map(event => event.returnValues.nodeAddress)

      const eventList2 = await getDelegateToEventList(userAddress)
      nodesAddrs.push(...eventList2.map(event => event.returnValues.nodeAddr))
    } else {
      // search nodes
      nodesAddrs = Array.from(await contractInstance.methods.getNodeAddrs().call());
      if (userAddress) {
        //Let owne and delegate nodes show first
        const eventList = await getLogNewNodeEventList(userAddress)
        nodesAddrs.unshift(...eventList.reverse().map(event => event.returnValues.nodeAddress))
        const eventList2 = await getDelegateToEventList(userAddress)
        nodesAddrs.unshift(...eventList2.reverse().map(event => event.returnValues.nodeAddr))
      }
    }
    let filtedNodes = []
    if (searchAddress) {
      filtedNodes = nodesAddrs.filter(nodeaddress => nodeaddress === searchAddress)
    } else {
      filtedNodes = nodesAddrs
    }
    let noSameKeyNodes = new Set(filtedNodes);
    filtedNodes = Array.from(noSameKeyNodes)
    //做去重
    this.setState({
      cachedNodes: filtedNodes
    })
    let total = filtedNodes.length
    let startIndex = (current - 1) * pageSize
    let endIndex = Math.min(total - startIndex, current * pageSize)
    console.log(total, startIndex, endIndex)
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
      const { selfStakedAmount, totalOtherDelegatedAmount, rewardCut } = node;
      const { delegatedAmount, accumulatedReward } = delegator;
      const nodeObject = {
        nameKey: `name-${nodeAddr}`,
        node: nodeAddr,
        selfStaked: fromWei(selfStakedAmount),
        totalDelegated: fromWei(totalOtherDelegatedAmount),
        totalRewards: fromWei(node.accumulatedReward),
        rewardCut: rewardCut,
        uptime: Math.round(uptime.toNumber() / (60 * 60 * 24)),
        myDelegation: fromWei(delegatedAmount),
        myRewards: fromWei(accumulatedReward)
      };
      nodeList.push(nodeObject);
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
  onSearchAddress = (address) => {
    this.setState({
      searchAddress: address
    })
    this.loadNodeList(address)
  }
  render() {
    let { isMetaMaskLogin } = this.props.contract;
    let showRelatedNodes = this.props.showRelatedNodes;
    console.log(`defaultCheck:${showRelatedNodes}`)
    return (
      <>
        <div className='node-list--header-wrapper'>
          {isMetaMaskLogin ? (
            <div className='node-list--header-left'>
              <Button type="primary" onClick={this.showModal}>
                Create a Node
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <NewNode
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
                confirmLoading={this.state.confirmLoading}
                modalText={this.state.formText}
              />
              <Switch defaultChecked={showRelatedNodes} onChange={this.onChange} />&nbsp;Only Show The Nodes Related To Me
          </div>
          )
            : <div className='node-list--header-left'></div>}
          <div className="node-list--header-right">
            <Search
              placeholder="search node address"
              onSearch={this.onSearchAddress}
              style={{ width: 200 }}
            />
          </div>
        </div>
        <Table
          rowKey={record => record.node}
          loading={this.state.loading}
          dataSource={this.state.dataList}
          pagination={{ size: 'small', ...this.state.pagination }}
          rowClassName={(row, index) => {
            return index % 2 === 0 ? "row-light" : "row-dark";
          }}
          onChange={this.handleTableChange}
        >
          <Column
            title="Name"
            render={nameColumnRender}
            dataIndex="nameKey"
          />
          <Column
            title="Node"
            render={nodeColumnRender}
            dataIndex="node"
            key="node"
          />
          <Column
            title={tableTitleWithTipsRender('SelfStake', 'The Amount of DOS this node staked.')}
            render={numberFormatRender}
            dataIndex="selfStaked"
            key="selfStaked"
            sorter={(a, b) => a.selfStaked - b.selfStaked}
            sortDirections={["ascend", "descend"]}
          />
          <Column
            title={tableTitleWithTipsRender('Delegate', 'Total Amount of DOS delegated towards this node.')}
            render={numberFormatRender}
            dataIndex="totalDelegated"
            key="totalDelegated"
            sorter={(a, b) => a.totalDelegated - b.totalDelegated}
            sortDirections={["ascend", "descend"]}
          />
          <Column
            title={tableTitleWithTipsRender('Rewards', 'Total rewards this node created, including rewards for users who delegated towards this node.')}
            render={numberFormatRender}
            dataIndex="totalRewards"
            key="totalRewards"
            sorter={(a, b) => a.totalRewards - b.totalRewards}
            sortDirections={["ascend", "descend"]}
          />
          <Column
            title={tableTitleWithTipsRender('Reward Cut', 'The percentage of DOS token this node will keep from user’s staking rewards.')}
            render={t => `${t}%`}
            dataIndex="rewardCut"
            key="rewardCut"
            sorter={(a, b) => a.rewardCut - b.rewardCut}
            sortDirections={["ascend", "descend"]}
          />
          <Column
            title={tableTitleWithTipsRender('Uptime', 'Total active time of this node.')}
            render={t => `${t} days`}
            dataIndex="uptime"
            key="uptime"
            sorter={(a, b) => a.uptime - b.uptime}
            sortDirections={["ascend", "descend"]}
          />
          {isMetaMaskLogin ? (
            <Column
              title={tableTitleWithTipsRender('MyDelegation', 'The amount of DOS you delegated towards this node.')}
              render={myDelegationFormatRender}
              dataIndex="myDelegation"
              key="myDelegation"
              sorter={(a, b) => a.myDelegation - b.myDelegation}
              sortDirections={["ascend", "descend"]}
            />
          ) : null}
          {isMetaMaskLogin ? (
            <Column
              title={tableTitleWithTipsRender('MyRewards', 'The amount of rewards you get from this node.')}
              render={myDelegationFormatRender}
              dataIndex="myRewards"
              key="myRewards"
              sorter={(a, b) => a.myRewards - b.myRewards}
              sortDirections={["ascend", "descend"]}
            />
          ) : null}
        </Table>
      </>
    );
  }
}
