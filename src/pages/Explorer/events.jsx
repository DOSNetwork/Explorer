import React from 'react'
import { Table } from 'antd'
import { MoreInfoRender, TxHashRender } from './tableRender.jsx'
const { Column } = Table
export const EventsList = ({ pageSize, currentPageIndex, totalCount, events, loading, searchText, explorerSearch, history, f }) => {
    function handlePaginationChange({ current, pageSize }) {
        explorerSearch(searchText, pageSize, current - 1, history);
    }
    return (
        <div className="search-result--wrapper">
            <span className="search-result--title">{f({ id: 'Tooltip.Explorer.Pagnation' }, { pageSize: pageSize })}</span>
            <Table rowKey={record => record.txHash + record.eventLog + record.ID} loading={loading} dataSource={events} size="small"
                onChange={handlePaginationChange}
            >
                <Column title={f({ id: 'Table.Column.Explorer.TxHash' })} dataIndex="txHash" key="txHash" width={100} render={TxHashRender} />
                <Column title={f({ id: 'Table.Column.Explorer.Blocks' })} dataIndex="blockNumber" key="blockNumber" width={70} />
                <Column width={250} title={f({ id: 'Table.Column.Explorer.EventLog' })} key="eventLog" render={MoreInfoRender} />
            </Table>
        </div>
    )
}
