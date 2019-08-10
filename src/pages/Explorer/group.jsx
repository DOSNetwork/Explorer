import React from 'react'
import { Descriptions } from 'antd'
import EllipsisWrapper from '../../components/EllispisWrapper'
export const GroupDetail = ({ group }) => {
    let groupDetail = (group && group[0]) || {
        groupId: 'NOT FOUND',
        nodeId: [],
        pubKey: []
    }
    return (
        <Descriptions title="Group Info" bordered column={3}>
            <Descriptions.Item label="Group Id" span={3}>
                <EllipsisWrapper text={groupDetail.groupId} />
            </Descriptions.Item>
            <Descriptions.Item label="Accepted Block Number" span={3}>
                {groupDetail.acceptedBlknum}
            </Descriptions.Item>
            <Descriptions.Item label="Disresolved Block Number" span={3}>
                {groupDetail.dissolvedBlknum}
            </Descriptions.Item>
            <Descriptions.Item label="Url Requests" span={3}>
                {groupDetail.urlRequests}
            </Descriptions.Item>
            <Descriptions.Item label="Random Requests" span={3}>
                {groupDetail.randomRequests}
            </Descriptions.Item>
            <Descriptions.Item label="Group Publick Key" span={3}>
                {
                    groupDetail.pubKey && groupDetail.pubKey.map(Id => {
                        return <EllipsisWrapper key={Id} text={Id} />
                    })
                }
            </Descriptions.Item >
            <Descriptions.Item label="Group NodeIds" span={3}>
                {
                    groupDetail.nodeId && groupDetail.nodeId.map(Id => {
                        return <EllipsisWrapper key={Id} text={Id} />
                    })
                }
            </Descriptions.Item>
        </Descriptions>
    )
}
