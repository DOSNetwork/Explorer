import React from 'react'
import { Descriptions, Icon, Typography } from 'antd'
const { Paragraph } = Typography;
export const GroupDetail = ({ group }) => {
    let groupDetail = (group && group[0]) || {
        groupId: 'NOT FOUND',
        nodeId: [],
        pubKey: []
    }
    return (
        <Descriptions title="Group Info" bordered column={3}>
            <Descriptions.Item label="Group Id" span={3}>
                <Paragraph copyable={{ text: groupDetail.groupId }}>
                    {groupDetail.groupId}
                </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Group NodeIds" span={3}>
                {
                    groupDetail.nodeId && groupDetail.nodeId.map(Id => {
                        return <p key={Id} className='nodes-item' ><Icon style={{ fontSize: 13 }} type="tag" /> - {Id}</p>
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Group Publick Key" span={3}>
                {
                    groupDetail.pubKey && groupDetail.pubKey.map(Id => {
                        return <p key={Id} className='nodes-item' ><Icon style={{ fontSize: 13 }} type="tag" /> - {Id}</p>
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Accepted Block Number">
                {groupDetail.acceptedBlknum}
            </Descriptions.Item>
            <Descriptions.Item label="Disresolved Block Number">
                {groupDetail.dissolvedBlknum}
            </Descriptions.Item>
            <Descriptions.Item label="Url Requests">
                {groupDetail.urlRequests}
            </Descriptions.Item>
            <Descriptions.Item label="Random Requests">
                {groupDetail.randomRequests}
            </Descriptions.Item>
        </Descriptions>
    )
}
