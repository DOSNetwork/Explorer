import React, { Component } from 'react'
import { SubTitle } from '../../Layout/page'
import { Table } from 'antd'
import dateformat from 'dateformat'
import axios from 'axios';
const { Column } = Table
const dateFormatRender = (text, record, index) => {
    let value = dateformat(record.time, 'h:MM:ss TT yyyy/mm/dd')
    return (<span>{value}</span>)
}
export default class Activities extends Component {
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
    search = () => {
        this.setState({
            loading: true
        })
        axios.get('/api/account/activities').then(response => {
            // 鬼...结构
            let data = response.data.body
            this.setState({
                dataList: data.activities,
                loading: false
            })
        })
    }
    render() {
        return (
            <>
                <SubTitle title='Account Activity'></SubTitle>
                <Table rowKey={record => record.txHash}
                    loading={this.state.loading}
                    dataSource={this.state.dataList}
                    pagination={false}
                    rowClassName={(row, index) => {
                        return index % 2 === 0 ? 'row-light' : 'row-dark'
                    }}>
                    <Column title="Time"
                        render={dateFormatRender}
                        sorter={(a, b) => +new Date(a.time) - +new Date(b.time)}
                        sortDirections={['ascend', 'descend']}
                        dataIndex="time"
                        key="time" />
                    <Column title="Action"
                        dataIndex="action"
                        key="action"
                        sortDirections={['ascend', 'descend']} />
                    <Column title="Tx Hash"
                        dataIndex="txHash"
                        key="txHash" />
                </Table>

            </>
        )
    }
}
