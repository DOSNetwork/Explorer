import React, { Component } from 'react'
import { Table } from 'antd'
import SearchInput from '../../components/SearchInput'
import { PageTitle } from '../../Layout/page'
import { MoreInfoRender, TxHashRender } from './tableRender'
import './style.scss';
import axios from 'axios';


const { Column } = Table

export default class Explorer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: [],
            loading: false,
            currentSearchText: '',
            pageSize: 100,
            currentPageIndex: 0,
            totalCount: 0
        }
    }
    componentDidMount() {
        this.handleSearch('')
    }
    handleSearch = (searchText) => {
        let { currentPageIndex, pageSize } = this.state
        this.search(searchText, currentPageIndex, pageSize);
    }
    handlePaginationChange = ({ current, pageSize }) => {
        let { currentSearchText } = this.state
        this.search(currentSearchText, current - 1, pageSize);
    }
    search = (text, pageIndex, pageSize) => {
        this.setState({
            loading: true,
            currentSearchText: text,
            currentPageIndex: pageIndex
        })
        axios.get('/api/explorer/search', { params: { text: text, pageSize: pageSize, pageIndex: pageIndex } }).then(response => {
            let data = response.data.body
            this.setState({
                dataList: data.events,
                loading: false,
                totalCount: data.totalCount
            })
        })
    }
    render() {
        const { pageSize, currentPageIndex, totalCount } = this.state
        return (
            <div>
                <PageTitle title="Explorer" />
                <SearchInput onSearch={this.handleSearch}></SearchInput>
                <span className="search-result--title">Latest {pageSize} events</span>
                <Table rowKey={record => record.ID} loading={this.state.loading} dataSource={this.state.dataList} pagination={{ position: 'top', defaultCurrent: 1, defaultPageSize: 100, current: currentPageIndex + 1, total: totalCount }} size="middle" bordered onChange={this.handlePaginationChange}>
                    <Column title="Tx Hash" dataIndex="txHash" key="txHash" width={250} render={TxHashRender} />
                    <Column title="Blocks" dataIndex="blockNumber" key="blockNumber" width={70} />
                    <Column title="Event Log" dataIndex="eventLog" key="eventLog" width={250} />
                    <Column title="More Info" key="method" render={MoreInfoRender} />
                </Table>
            </div>
        )
    }
}
