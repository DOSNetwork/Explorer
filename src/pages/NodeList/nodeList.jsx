import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Table, message, Switch } from "antd";
import "./style.scss";
import numeral from "numeral";
import NewNode from "./newNodeForm";
import { DOS_ABI, DOS_CONTRACT_ADDRESS } from "../../util/const";
const { Column } = Table;

const nodeColumnRender = (text, record, index) => {
  let link = `/nodedetail/${record.node}`;
  // <img className="nodelist-avatar" src={record.avatar} alt="avatar" />
  return (
    <>
      <Link className="node-detail" to={link}>
        {text}
      </Link>
    </>
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
export default class NodeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      listCount: 100,
      visible: false,
      confirmLoading: false,
      showRelatedNodes: false,
      formText: "",
      fields: {
        nodeAddress: {
          value: "testxxxxxxxxxxxxxx"
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
          value: "test node description"
        }
      }
    };
  }
  componentDidMount() {
    this.loadNodeList();
  }
  getSnapshotBeforeUpdate(prevProps) {
    let userLogined =
      prevProps.contract.userAddress === "" && this.props.contract.userAddress;
    return { userLogined: userLogined };
  }
  componentDidUpdate(prevProps, preState, snapShot) {
    if (snapShot.userLogined) {
      this.loadNodeList();
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
      console.log("Received values of form: ", values);
      console.log("tokenAmount ", tokenAmount);

      let emitter = contractInstance.methods
        .newNode(values.nodeAddr, tokenAmount, 0, values.cutRate, "test")
        .send({ from: userAddress });
      let hide;
      var hashHandler = function(hash) {
        emitter.removeListener("transactionHash", hashHandler);
        hide = message.loading("New node: wait for confirmatin : " + hash, 0);
      };

      var confirmationHandler = function(confirmationNumber, receipt) {
        //TODO : Update progress to user
        hide();
        emitter.removeListener("confirmation", confirmationHandler);
        message.success(
          "New node: success (confirmed block " + receipt.blockNumber + ")"
        );
      };
      var errorHandler = function(error) {
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
    console.log(changedFields);
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
  };
  onChange = checked => {
    console.log(`switch to ${checked}`);
    this.setState({
      showRelatedNodes: checked
    });
    this.loadNodeList();
  };
  loadNodeList = async () => {
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
    let nodesAddrs = [];
    let nodeList = [];
    console.log("showRelatedNodes ", this.state.showRelatedNodes);
    if (this.state.showRelatedNodes) {
      const options = {
        filter: { owner: userAddress },
        fromBlock: 5414653,
        toBlock: "latest"
      };

      const eventList = await contractInstance.getPastEvents(
        "LogNewNode",
        options
      );
      for (let i = 0; i < eventList.length; i++) {
        nodesAddrs.push(eventList[i].returnValues.nodeAddress);
      }
      const options2 = {
        filter: { sender: userAddress },
        fromBlock: 5414653,
        toBlock: "latest"
      };
      const eventList2 = await contractInstance.getPastEvents(
        "DelegateTo",
        options2
      );
      for (let i = 0; i < eventList2.length; i++) {
        nodesAddrs.push(eventList2[i].returnValues.nodeAddr);
      }
    } else {
      nodesAddrs = await contractInstance.methods.getNodeAddrs().call();
      if (userAddress) {
        //Let owne and delegate nodes show first
        const options = {
          filter: { owner: userAddress },
          fromBlock: 5414653,
          toBlock: "latest"
        };

        const eventList = await contractInstance.getPastEvents(
          "LogNewNode",
          options
        );
        for (let i = 0; i < eventList.length; i++) {
          nodesAddrs.unshift(eventList[i].returnValues.nodeAddress);
        }
        const options2 = {
          filter: { sender: userAddress },
          fromBlock: 5414653,
          toBlock: "latest"
        };
        const eventList2 = await contractInstance.getPastEvents(
          "DelegateTo",
          options2
        );
        for (let i = 0; i < eventList2.length; i++) {
          nodesAddrs.unshift(eventList2[i].returnValues.nodeAddr);
        }
      }
    }

    const addrs = nodesAddrs.filter((item, index) => {
      return nodesAddrs.indexOf(item) === index;
    });
    let listNumber = Math.min(addrs.length, 10);
    for (let i = 0; i < listNumber; i++) {
      const nodeAddr = addrs[i];
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

      console.log(nodeAddr, " ", node.selfStakedAmount, " ", uptime);
      const { selfStakedAmount, totalOtherDelegatedAmount, rewardCut } = node;
      const { delegatedAmount, accumulatedReward } = delegator;
      const nodeObject = {
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
      loading: false
    });
  };
  render() {
    let { isMetaMaskLogin } = this.props.contract;
    return (
      <>
        {isMetaMaskLogin ? (
          <div>
            <Button type="primary" onClick={this.showModal}>
              New Node
            </Button>
            <NewNode
              wrappedComponentRef={this.saveFormRef}
              visible={this.state.visible}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
              confirmLoading={this.state.confirmLoading}
              modalText={this.state.formText}
            />
          </div>
        ) : null}
        <Switch defaultChecked onChange={this.onChange} />
        <Table
          rowKey={record => record.node}
          loading={this.state.loading}
          dataSource={this.state.dataList}
          pagination={false}
          rowClassName={(row, index) => {
            return index % 2 === 0 ? "row-light" : "row-dark";
          }}
        >
          <Column
            title="Node"
            render={nodeColumnRender}
            dataIndex="node"
            key="node"
          />
          <Column
            title="Self Staked"
            render={numberFormatRender}
            dataIndex="selfStaked"
            key="selfStaked"
            sorter={(a, b) => a.selfStaked - b.selfStaked}
            sortDirections={["ascend", "descend"]}
          />
          <Column
            title="Total Delegated"
            render={numberFormatRender}
            dataIndex="totalDelegated"
            key="totalDelegated"
            sorter={(a, b) => a.totalDelegated - b.totalDelegated}
            sortDirections={["ascend", "descend"]}
          />
          <Column
            title="Reward Cut"
            render={t => `${t}%`}
            dataIndex="rewardCut"
            key="rewardCut"
            sorter={(a, b) => a.rewardCut - b.rewardCut}
            sortDirections={["ascend", "descend"]}
          />
          <Column
            title="Total Rewards"
            render={numberFormatRender}
            dataIndex="totalRewards"
            key="totalRewards"
            sorter={(a, b) => a.totalRewards - b.totalRewards}
            sortDirections={["ascend", "descend"]}
          />
          <Column
            title="Uptime"
            render={t => `${t} days`}
            dataIndex="uptime"
            key="uptime"
            sorter={(a, b) => a.uptime - b.uptime}
            sortDirections={["ascend", "descend"]}
          />
          {isMetaMaskLogin ? (
            <Column
              title="MyDelegation"
              render={myDelegationFormatRender}
              dataIndex="myDelegation"
              key="myDelegation"
              sorter={(a, b) => a.myDelegation - b.myDelegation}
              sortDirections={["ascend", "descend"]}
            />
          ) : null}
          {isMetaMaskLogin ? (
            <Column
              title="MyRewards"
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
