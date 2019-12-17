import React from 'react'
import { Descriptions } from 'antd'
import EllipsisWrapper from '../../components/EllispisWrapper'
export const GroupDetail = ({ group, f }) => {
    let groupDetail = (group && group[0]) || {
        groupId: 'NOT FOUND',
        nodeId: [],
        pubKey: []
    }
    return (
        <Descriptions title={f({ id: 'Table.Column.Explorer.GroupInfo' })} bordered column={3}>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.GroupId' })} span={3}>
                <EllipsisWrapper text={groupDetail.groupId} />
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.AcceptedBlockNumber' })} span={3}>
                {groupDetail.acceptedBlknum}
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.DissolvedBlockNumber' })} span={3}>
                {groupDetail.dissolvedBlknum}
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.UrlRequests' })} span={3}>
                {groupDetail.urlRequests}
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.RandomRequests' })} span={3}>
                {groupDetail.randomRequests}
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.GroupPublickKey' })} span={3}>
                {
                    groupDetail.pubKey && groupDetail.pubKey.map(Id => {
                        return <EllipsisWrapper key={Id} text={Id} />
                    })
                }
            </Descriptions.Item >
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.GroupNodeIds' })} span={3}>
                {
                    groupDetail.nodeId && groupDetail.nodeId.map(Id => {
                        return <EllipsisWrapper key={Id} text={Id} />
                    })
                }
            </Descriptions.Item>
        </Descriptions>
    )
}
