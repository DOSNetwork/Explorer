import React from 'react'
import { Descriptions } from 'antd'
import EllipsisWrapper from '../../components/EllispisWrapper'

export const RandomDetail = ({ random }) => {
    let randomDetail = (random && random[0]) || {
        requestId: 'NOT FOUND',
        signature: [],
        pubKey: []
    }
    return (
        <Descriptions title="Request Info" bordered column={3}>
            <Descriptions.Item label="Request Id" span={3}>
                <EllipsisWrapper text={randomDetail.requestId} />
            </Descriptions.Item>
            <Descriptions.Item label="Dispatched Group Id" span={3}>
                {randomDetail.dispatchedGroupId}
            </Descriptions.Item>
            <Descriptions.Item label="Submitter" span={3}>
                {randomDetail.submitter}
            </Descriptions.Item>
            <Descriptions.Item label="Submitted Block Number" span={3}>
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
                    randomDetail.signature && randomDetail.signature.map(Id => {
                        return <EllipsisWrapper key={Id} text={Id} />
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Publick Key" span={3}>
                {
                    randomDetail.pubKey && randomDetail.pubKey.map(Id => {
                        return <EllipsisWrapper key={Id} text={Id} />
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Last System Randomness">
                {randomDetail.lastSystemRandomness}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="User Seed">
                {randomDetail.userSeed}
            </Descriptions.Item>
            <Descriptions.Item label="Pass" span={3}>
                {`${randomDetail.pass}`}
            </Descriptions.Item>
        </Descriptions>
    )
}
