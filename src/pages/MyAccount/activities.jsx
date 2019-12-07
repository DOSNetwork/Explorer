import React, { Component } from "react";
import { SubTitle } from "../../Layout/page";
import { Table } from "antd";
import dateformat from "dateformat";
import EllipsisWrapper from '../../components/EllispisWrapper'
import { DOS_ABI, DOS_CONTRACT_ADDRESS, BLOCK_NUMBER } from "../../util/const";

const { Column } = Table;
const dateFormatRender = (text, record, index) => {
  let value = dateformat(record.timestamp, "h:MM:ss TT yyyy/mm/dd");
  return <span>{value}</span>;
};
const txHashRender = (text) => {
  return (
    <EllipsisWrapper text={text} />
  )
}
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
  componentWillUnmount() {
    this.unMount = true;
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
        fromBlock: BLOCK_NUMBER,
        toBlock: "latest"
      };
      const options2 = {
        filter: { sender: userAddress },
        fromBlock: BLOCK_NUMBER,
        toBlock: "latest"
      };
      const eventList = await contract.getPastEvents("LogNewNode", options);
      const eventList2 = await contract.getPastEvents("DelegateTo", options2);
      const eventList3 = await contract.getPastEvents("RewardWithdraw", options2);
      const eventList4 = await contract.getPastEvents("Unbond", options2);
      let dataList = [...eventList, ...eventList2, ...eventList3, ...eventList4].sort((a, b) => b.blockNumber - a.blockNumber)
      const CountsOfEventPerRequest = 10
      this.renderActiviesSequence(dataList, 0, CountsOfEventPerRequest, web3Client)
    }
  };
  renderActiviesSequence = async (dataList, index, step, web3Client) => {
    if (dataList.length === index) {
      return
    }
    let currentDataList = this.state.dataList
    let promiseArray = []
    let end = index + step < dataList.length ? index + step : dataList.length;
    for (let i = index; i < end; i++) {
      promiseArray.push(web3Client.eth.getBlock(dataList[i].blockNumber))
    }
    const datas = await Promise.all(promiseArray)
    for (let ii = 0; ii < datas.length; ii++) {
      let y = index + ii
      let { number, timestamp } = datas[ii]
      if (dataList[y].blockNumber === number) {
        dataList[y].timestamp = timestamp * 1000
        currentDataList.push(dataList[y])
      }
    }
    if (!this.unMount) {
      this.setState({
        dataList: currentDataList,
        loading: false
      })
      this.renderActiviesSequence(dataList, end, step, web3Client)
    }
  }
  render() {
    return (
      <>
        <SubTitle title="Account Activity"></SubTitle>
        <Table
          rowKey={record => record.transactionHash}
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
            sorter={(a, b) => a.timestamp - b.timestamp}
            sortDirections={["ascend", "descend"]}
            dataIndex="timestamp"
            key="timestamp"
          />
          {/* <Column
            title="Time"
            sorter={(a, b) => a.blockNumber - b.blockNumber}
            sortDirections={["ascend", "descend"]}
            dataIndex="blockNumber"
          /> */}
          <Column
            title="Action"
            dataIndex="event"
          />
          <Column title="Tx Hash"
            render={txHashRender}
            dataIndex="transactionHash"
            key="transactionHash" />
        </Table>
      </>
    );
  }
}
