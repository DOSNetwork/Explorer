import React from 'react'
import { Descriptions, Icon, Typography } from 'antd'
const { Paragraph } = Typography;
export const RequestDetail = ({ request }) => {
    let requestDetail = (request && request[0]) || {
        requestId: 'NOT FOUND',
        signature: [],
        pubKey: []
    }
    return (
        <Descriptions title="Request Info" bordered column={3}>
            <Descriptions.Item label="Request Id" span={3}>
                <Paragraph copyable={{ text: requestDetail.requestId }}>
                    {requestDetail.requestId}
                </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Dispatched Group Id" span={3}>
                {requestDetail.dispatchedGroupId}
            </Descriptions.Item>
            <Descriptions.Item label="Submitter" span={2}>
                {requestDetail.submitter}
            </Descriptions.Item>
            <Descriptions.Item label="Submitted Block Number">
                {requestDetail.submittedBlkNum}
            </Descriptions.Item>
            <Descriptions.Item label="Submitted TxHash" span={3}>
                {requestDetail.submittedTxHash}
            </Descriptions.Item>
            <Descriptions.Item label="Message" span={3}>
                {requestDetail.message}
            </Descriptions.Item>
            <Descriptions.Item label="Signature" span={3}>
                {
                    requestDetail.signature.map(item => {
                        return <p key={item} className='nodes-item' ><Icon style={{ fontSize: 13 }} type="tag" /> - {item}</p>
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Publick Key" span={3}>
                {
                    requestDetail.pubKey.map(Id => {
                        return <p key={Id} className='nodes-item' ><Icon style={{ fontSize: 13 }} type="tag" /> - {Id}</p>
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Pass">
                {requestDetail.pass}
            </Descriptions.Item>
            <Descriptions.Item label="TimeOut">
                {requestDetail.timeOut}
            </Descriptions.Item>
            <Descriptions.Item label="Selector">
                {requestDetail.selector}
            </Descriptions.Item>
            <Descriptions.Item label="Data Source">
                {requestDetail.dataSource}
            </Descriptions.Item>
            <Descriptions.Item label="Randomness">
                {requestDetail.randomness}
            </Descriptions.Item>
        </Descriptions>
    )
}
