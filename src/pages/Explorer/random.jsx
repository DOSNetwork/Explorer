import React from 'react'
import { Descriptions } from 'antd'
import EllipsisWrapper from '../../components/EllispisWrapper'

export const RandomDetail = ({ random, f }) => {
    let randomDetail = (random && random[0]) || {
        requestId: 'NOT FOUND',
        signature: [],
        pubKey: []
    }
    return (
        <Descriptions title={f({ id: 'Table.Column.Explorer.Request Info' })} bordered column={3}>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.RequestId' })} span={3}>
                <EllipsisWrapper text={randomDetail.requestId} />
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.DispatchedGroupId' })} span={3}>
                {randomDetail.dispatchedGroupId}
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.Submitter' })} span={3}>
                {randomDetail.submitter}
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.SubmittedBlockNumber' })} span={3}>
                {randomDetail.submittedBlkNum}
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.SubmittedTxHash' })} span={3}>
                {randomDetail.submittedTxHash}
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.Message' })} span={3}>
                {randomDetail.message}
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.Signature' })} span={3}>
                {
                    randomDetail.signature && randomDetail.signature.map(Id => {
                        return <EllipsisWrapper key={Id} text={Id} />
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.PublicKey' })} span={3}>
                {
                    randomDetail.pubKey && randomDetail.pubKey.map(Id => {
                        return <EllipsisWrapper key={Id} text={Id} />
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item span={3} label={f({ id: 'Table.Column.Explorer.LastSystemRandomness' })}>
                {randomDetail.lastSystemRandomness}
            </Descriptions.Item>
            <Descriptions.Item span={3} label={f({ id: 'Table.Column.Explorer.UserSeed' })}>
                {randomDetail.userSeed}
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.Pass' })} span={3}>
                {`${randomDetail.pass}`}
            </Descriptions.Item>
        </Descriptions>
    )
}
