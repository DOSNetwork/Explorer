import React from 'react'
import { Table } from 'antd'
import { MoreInfoRender, TxHashRender } from './tableRender.jsx'
const { Column } = Table
export const EventsList = ({ pageSize, currentPageIndex, totalCount, events, loading, searchText, explorerSearch, history }) => {
    function handlePaginationChange({ current, pageSize }) {
        explorerSearch(searchText, pageSize, current - 1, history);
    }

    // let pagination = {}
    // // let pagination = { position: 'top', defaultCurrent: 1, defaultPageSize: 20, current: currentPageIndex + 1, total: totalCount }
    // if (currentPageIndex === 0 && totalCount < pageSize) {

    // }
    return (
        <div className="search-result--wrapper">
            <span className="search-result--title">Latest {pageSize} events</span>
            <Table rowKey={record => record.txHash + record.eventLog + record.ID} loading={loading} dataSource={events} size="small"
                onChange={handlePaginationChange}
            >
                <Column title="Tx Hash" dataIndex="txHash" key="txHash" width={250} render={TxHashRender} />
                <Column title="Blocks" dataIndex="blockNumber" key="blockNumber" width={70} />
                <Column width={250} title="Event Log" key="eventLog" render={MoreInfoRender} />
            </Table>
        </div>
    )
}
