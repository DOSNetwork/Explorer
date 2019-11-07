import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Table } from 'antd'
import axios from 'axios';
import './style.scss';
import numeral from 'numeral';
import { DOS_ABI, DOS_CONTRACT_ADDRESS } from '../../util/const'
const { Column } = Table
const nodeColumnRender = (text, record, index) => {
    let link = `/nodedetail/${record.node}`;
    return <><img className="nodelist-avatar" src={record.avatar} alt="avatar" /><Link className='node-detail' to={link}>{text}</Link></>
}
const numberFormatRender = (text, record, index) => {
    return numeral(text).format('0,0')
}
const myDelegationFormatRender = (text, record, index) => {
    if (text === 0) {
        return '-'
    } else {
        return numberFormatRender(text)
    }
}
export default class NodeList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            listCount: 100,
        }
    }
    componentDidMount() {
        this.loadNodeList();
    }
    getSnapshotBeforeUpdate(prevProps) {
        let userLogined = (prevProps.contract.userAddress === '' && this.props.contract.userAddress)
        return { userLogined: userLogined }
    }
    componentDidUpdate(prevProps, preState, snapShot) {
        if (snapShot.userLogined) {
            this.loadNodeList()
        }
    }
    loadNodeList = async () => {
        function fromWei(bn) {
            if (!bn || bn === '-') {
                return ''
            }
            return web3Client.utils.fromWei(bn.toString('10'))
        }

        this.setState({
            loading: true
        })

        const { web3Client, userAddress } = this.props.contract
        let contractInstance = new web3Client.eth.Contract(DOS_ABI, DOS_CONTRACT_ADDRESS);
        let nodesAddrs = await contractInstance.methods.getNodeAddrs().call()
        let nodeList = []
        for (let i = 0; i < nodesAddrs.length; i++) {
            let nodeAddr = nodesAddrs[i];
            const node = await contractInstance.methods.nodes(nodeAddr).call();
            let delegator = { myDelegator: '-', accumulatedReward: '-' }
            if (userAddress) {
                delegator = await contractInstance.methods
                    .delegators(userAddress, nodeAddr)
                    .call();
            }
            let {
                selfStaked, totalDelegated, rewardCut
            } = node
            let { myDelegator, accumulatedReward } = delegator;
            let nodeObject = {
                node: nodeAddr,
                selfStaked: fromWei(selfStaked),
                totalDelegated: fromWei(totalDelegated),
                rewardCut: rewardCut,
                uptime: 999,
                myDelegation: fromWei(myDelegator),
                myRewards: fromWei(accumulatedReward)
            }
            nodeList.push(nodeObject)
        }
        this.setState({
            dataList: nodeList,
            loading: false
        })
    }
    render() {
        let { isMetaMaskLogin } = this.props.contract
        return (
            <Table rowKey={record => record.node}
                loading={this.state.loading}
                dataSource={this.state.dataList}
                pagination={false}
                rowClassName={(row, index) => {
                    return index % 2 === 0 ? 'row-light' : 'row-dark'
                }}>
                <Column title="Node"
                    render={nodeColumnRender}
                    dataIndex="node"
                    key="node" />
                <Column title="Self Staked"
                    render={numberFormatRender}
                    dataIndex="selfStaked"
                    key="selfStaked"
                    sorter={(a, b) => a.selfStaked - b.selfStaked}
                    sortDirections={['ascend', 'descend']} />
                <Column title="Total Delegated"
                    render={numberFormatRender}
                    dataIndex="totalDelegated"
                    key="totalDelegated"
                    sorter={(a, b) => a.totalDelegated - b.totalDelegated}
                    sortDirections={['ascend', 'descend']} />
                <Column title="Reward Cut"
                    render={(t) => `${t}%`}
                    dataIndex="rewardCut"
                    key="rewardCut"
                    sorter={(a, b) => a.rewardCut - b.rewardCut}
                    sortDirections={['ascend', 'descend']} />
                <Column title="Total Rewards"
                    render={numberFormatRender}
                    dataIndex="totalRewards"
                    key="totalRewards"
                    sorter={(a, b) => a.totalRewards - b.totalRewards}
                    sortDirections={['ascend', 'descend']} />
                <Column title="Uptime"
                    render={(t) => `${t} days`}
                    dataIndex="uptime"
                    key="uptime"
                    sorter={(a, b) => a.uptime - b.uptime}
                    sortDirections={['ascend', 'descend']} />
                {
                    isMetaMaskLogin ? <Column title="MyDelegation"
                        render={myDelegationFormatRender}
                        dataIndex="myDelegation"
                        key="myDelegation"
                        sorter={(a, b) => a.myDelegation - b.myDelegation}
                        sortDirections={['ascend', 'descend']} /> : null
                }
                {
                    isMetaMaskLogin ? <Column title="MyRewards"
                        render={myDelegationFormatRender}
                        dataIndex="myRewards"
                        key="myRewards"
                        sorter={(a, b) => a.myRewards - b.myRewards}
                        sortDirections={['ascend', 'descend']} /> : null
                }

            </Table>
        )
    }
}
