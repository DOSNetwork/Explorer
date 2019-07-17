import React from 'react'
import { Descriptions, Icon } from 'antd'
export const GroupDetail = ({ groups }) => {
    let group = (groups && groups[0]) || {
        groupId: 'NOT FOUND',
        groupMembers: [],
        groupPubKey: [],
        suggestedBlockNumber: []
    }
    return (
        <Descriptions title="Group Info" bordered>
            <Descriptions.Item label="Group Id" span={3}>{group.groupId}</Descriptions.Item>
            <Descriptions.Item label="Group Members" span={3}>
                {
                    group.groupMembers.map(Id => {
                        return <p key={Id} className='nodes-item' ><Icon style={{ fontSize: 13 }} type="tag" /> - {Id}</p>
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Group Publick Key" span={3}>
                {
                    group.groupPubKey.map(Id => {
                        return <p key={Id} className='nodes-item' ><Icon style={{ fontSize: 13 }} type="tag" /> - {Id}</p>
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Started Block Number">{group.startedBlockNumber}</Descriptions.Item>
            <Descriptions.Item label="Accepted Block Number">
                {group.acceptedBlockNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Resolved Block Number">
                {group.resolvedBlockNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Suggested Block Number" span={3}>
                {
                    group.suggestedBlockNumber.map(Id => {
                        return <p key={Id} ><Icon style={{ fontSize: 13 }} type="tag" /> - {Id}</p>
                    })
                }
            </Descriptions.Item>
        </Descriptions>
    )
}
