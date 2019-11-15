import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "antd";
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

      let stateControll = this;
      let emitter = contractInstance.methods
        .newNode(values.nodeAddr, tokenAmount, 0, values.cutRate, "test")
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
          delegateFormLoading: false,
          formText: "Submit success in block " + receipt.blockNumber
        });
        emitter.removeListener("confirmation", confirmationHandler);
        emitter.removeListener("error", errorHandler);
        setTimeout(() => {
          stateControll.setState({
            delegateFormVisible: false,
            formText: "",
            delegateFormLoading: false
          });
        }, 2000);
      };
      var errorHandler = function(error) {
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

  handleFormChange = changedFields => {
    console.log(changedFields);
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
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
    console.log(this.props);
    const { web3Client, userAddress } = this.props.contract;
    let contractInstance = new web3Client.eth.Contract(
      DOS_ABI,
      DOS_CONTRACT_ADDRESS
    );
    let nodesAddrs = await contractInstance.methods.getNodeAddrs().call();
    if (nodesAddrs == null) {
      return;
    }
    let nodeList = [];
    for (let i = 0; i < 10; i++) {
      const nodeAddr = nodesAddrs[i];
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
