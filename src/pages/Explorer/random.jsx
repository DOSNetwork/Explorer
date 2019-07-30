import React from 'react'
import { Descriptions, Icon, Typography } from 'antd'
const { Paragraph } = Typography;
export const RandomDetail = ({ random }) => {
    let randomDetail = (random && random[0]) || {
        requestId: 'NOT FOUND',
        signature: [],
        pubKey: []
    }
    return (
        <Descriptions title="Request Info" bordered column={3}>
            <Descriptions.Item label="Request Id" span={3}>
                <Paragraph copyable={{ text: randomDetail.requestId }}>
                    {randomDetail.requestId}
                </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Dispatched Group Id" span={3}>
                {randomDetail.dispatchedGroupId}
            </Descriptions.Item>
            <Descriptions.Item label="Submitter" span={2}>
                {randomDetail.submitter}
            </Descriptions.Item>
            <Descriptions.Item label="Submitted Block Number">
                {randomDetail.submittedBlkNum}
            </Descriptions.Item>
            <Descriptions.Item label="Submitted TxHash" span={3}>
                {randomDetail.submittedTxHash}
            </Descriptions.Item>
            <Descriptions.Item label="Message" span={3}>
                {randomDetail.message}
            </Descriptions.Item>
            <Descriptions.Item label="Signature" span={3}>
                {
                    randomDetail.signature && randomDetail.signature.map(item => {
                        return <p key={item} className='nodes-item' ><Icon style={{ fontSize: 13 }} type="tag" /> - {item}</p>
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Publick Key" span={3}>
                {
                    randomDetail.pubKey && randomDetail.pubKey.map(Id => {
                        return <p key={Id} className='nodes-item' ><Icon style={{ fontSize: 13 }} type="tag" /> - {Id}</p>
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Last System Randomness">
                {randomDetail.lastSystemRandomness}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="User Seed">
                {randomDetail.userSeed}
            </Descriptions.Item>
            <Descriptions.Item label="Pass">
                {`${randomDetail.pass}`}
            </Descriptions.Item>
        </Descriptions>
    )
}
