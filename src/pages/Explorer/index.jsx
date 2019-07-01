import React, { Component } from 'react'
import { Table } from 'antd'
import SearchInput from '../../components/SearchInput'
import { PageTitle } from '../../Layout/page'
import './style.scss';
import axios from 'axios';

const { Column } = Table

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
        console.log(searchText)
        this.search();
    }
    search = () => {
        this.setState({
            loading: true
        })
        axios.get('/api/explorer/search').then(response => {
            // 鬼...结构
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
                <Table rowKey={record => record.txHash} loading={this.state.loading} dataSource={this.state.dataList} pagination={false} >
                    <Column title="Tx Hash" dataIndex="txHash" key="txHash" />
                    <Column title="Method" dataIndex="method" key="method" />
                    <Column title="Event Log" dataIndex="eventLog" key="eventLog" />
                </Table>
            </div>
        )
    }
}
