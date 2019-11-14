import React, { Component } from "react";
import { SubTitle } from "../../Layout/page";
import { Table } from "antd";
import dateformat from "dateformat";
import { DOS_ABI, DOS_CONTRACT_ADDRESS } from "../../util/const";

const { Column } = Table;
const dateFormatRender = (text, record, index) => {
  let value = dateformat(record.time, "h:MM:ss TT yyyy/mm/dd");
  return <span>{value}</span>;
};
export default class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      loading: false,
      listCount: 100
    };
  }
  componentDidMount() {
    this.search();
  }
  getSnapshotBeforeUpdate(prevProps) {
    let userLogined =
      prevProps.contract.userAddress === "" && this.props.contract.userAddress;
    return { userLogined: userLogined };
  }
  componentDidUpdate(prevProps, preState, snapShot) {
    if (snapShot.userLogined) {
      this.search();
    }
  }
  search = async () => {
    const { isMetaMaskLogin, web3Client, userAddress } = this.props.contract;
    if (isMetaMaskLogin) {
      this.setState({
        loading: true
      });
      const contract = new web3Client.eth.Contract(
        DOS_ABI,
        DOS_CONTRACT_ADDRESS
      );

      const options = {
        filter: { owner: userAddress },
        fromBlock: 5414653,
        toBlock: "latest"
      };

      const eventList = await contract.getPastEvents("LogNewNode", options);
      if (eventList.length !== 0) {
        console.log("length", eventList.length);
        console.log(eventList[0].event);
      }
      const options2 = {
        filter: { sender: userAddress },
        fromBlock: 5414653,
        toBlock: "latest"
      };
      const eventList2 = await contract.getPastEvents("DelegateTo", options2);
      if (eventList2.length !== 0) {
        console.log("length", eventList2.length);
      }
      const eventList3 = await contract.getPastEvents(
        "RewardWithdraw",
        options2
      );
      if (eventList3.length !== 0) {
        console.log("length", eventList3.length);
      }
      const eventList4 = await contract.getPastEvents("Unbond", options2);
      if (eventList4.length !== 0) {
        console.log("length", eventList4.length);
      }
      //TODO: Update event to dataLisr
      this.setState({
        //dataList: data.activities,
        loading: false
      });
    }
  };
  render() {
    return (
      <>
        <SubTitle title="Account Activity"></SubTitle>
        <Table
          rowKey={record => record.txHash}
          loading={this.state.loading}
          dataSource={this.state.dataList}
          pagination={false}
          rowClassName={(row, index) => {
            return index % 2 === 0 ? "row-light" : "row-dark";
          }}
        >
          <Column
            title="Time"
            render={dateFormatRender}
            sorter={(a, b) => +new Date(a.time) - +new Date(b.time)}
            sortDirections={["ascend", "descend"]}
            dataIndex="time"
            key="time"
          />
          <Column
            title="Action"
            dataIndex="action"
            key="action"
            sortDirections={["ascend", "descend"]}
          />
          <Column title="Tx Hash" dataIndex="txHash" key="txHash" />
        </Table>
      </>
    );
  }
}
