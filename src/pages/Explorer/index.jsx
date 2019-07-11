import React, { Component } from 'react'
import { Table, Icon } from 'antd'
import SearchInput from '../../components/SearchInput'
import { PageTitle } from '../../Layout/page'
import './style.scss';
import axios from 'axios';

const { Column } = Table

const MoreInfoRender = (text, record, index) => {
    switch (record.eventLog) {
        case 'LogUpdateRandom':
            return LogUpdateRandomRender(record)
        case 'LogInsufficientWorkingGroup':
            return LogInsufficientWorkingGroupRender(record)
        case 'LogGrouping':
            return LogGroupingRender(record)
        case 'LogRequestUserRandom':
            return LogRequestUserRandomRender(record)
        case 'LogGroupingInitiated':
            return LogGroupingInitiatedRender(record)
        case 'GuardianReward':
            return GuardianRewardRender(record)
        default:
            return { text }
    }
}

const LogUpdateRandomRender = (record) => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Last Randomness</span>
            <span className="column-text">{record.lastRandomness}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Dispatched GroupId</span>
            <span className="column-text">{record.dispatchedGroupId}</span>
        </div>
    </div>
}
const LogInsufficientWorkingGroupRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Working Groups</span>
            <span className="column-text  text-number">{record.numWorkingGroups}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Pending Groups</span>
            <span className="column-text  text-number">{record.numPendingGroups}</span>
        </div>
    </div>
}
const LogGroupingRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">GroupId</span>
            <span className="column-text ">{record.groupId}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Nodes</span>
            <span className="column-text">
                {
                    record.nodeId.map(node => {
                        return <p class="nodes-item"><Icon style={{ fontSize: 13 }} type="tag" /> - {node}</p>
                    })
                }
            </span>
        </div>
    </div>
}

const LogRequestUserRandomRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">RequestId</span>
            <span className="column-text">{record.requestId}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Last System Randomness</span>
            <span className="column-text">{record.lastSystemRandomness}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">User Seed</span>
            <span className="column-text">{record.userSeed}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Dispatched GroupId</span>
            <span className="column-text ">{record.dispatchedGroupId}</span>
        </div>
    </div>
}
const LogGroupingInitiatedRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Pending Node Pool</span>
            <span className="column-text  text-number">{record.pendingNodePool}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Group Size</span>
            <span className="column-text  text-number">{record.groupSize}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Grouping Threshold</span>
            <span className="column-text  text-number">{record.groupingThreshold}</span>
        </div>
    </div>
}
const GuardianRewardRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Block Number</span>
            <span className="column-text text-number">{record.blkNum}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Guardian</span>
            <span className="column-text">{record.guardian}</span>
        </div>
    </div>
}
export default class Explorer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: [],
            loading: false,
            listCount: 100
        }
    }
    componentDidMount() {
        this.search();
    }
    handleSearch = (searchText) => {
        this.search();
    }
    search = () => {
        this.setState({
            loading: true
        })
        axios.get('/api/explorer/search').then(response => {
            let data = response.data.body
            this.setState({
                dataList: data.events,
                loading: false
            })
        })
    }
    render() {
        const { listCount } = this.state
        return (
            <div>
                <PageTitle title="Explorer" />
                <SearchInput onSearch={this.handleSearch}></SearchInput>
                <span className="search-result--title">Latest {listCount} events</span>
                <Table rowKey={record => record.txHash} loading={this.state.loading} dataSource={this.state.dataList} pagination={false} size="middle" scroll={{ y: 1000 }} bordered>
                    <Column title="Tx Hash" dataIndex="txHash" key="txHash" width={250} />
                    <Column title="Event Log" dataIndex="eventLog" key="eventLog" width={250} />
                    <Column title="More Info" key="method" render={MoreInfoRender} />
                </Table>
            </div>
        )
    }
}
