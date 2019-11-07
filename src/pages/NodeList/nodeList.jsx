import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Table } from 'antd'
import axios from 'axios';
import './style.scss';
import numeral from 'numeral';

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
            dataList: [],
            loading: false,
            isLogin: false,
            listCount: 100,
            userAddress: ''
        }
    }
    componentDidMount() {
        this.search();
    }
    search = () => {
        this.setState({
            loading: true
        })
        axios.get('/api/node/list').then(response => {
            // 鬼...结构
            let data = response.data.body
            this.setState({
                dataList: data.nodelist,
                loading: false
            })
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
