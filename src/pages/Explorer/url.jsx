import React from 'react'
import { Descriptions } from 'antd'
import EllipsisWrapper from '../../components/EllispisWrapper'

export const UrlDetail = ({ url }) => {
    let urlDetail = (url && url[0]) || {
        requestId: 'NOT FOUND',
        signature: [],
        pubKey: []
    }
    return (
        <Descriptions title="Request Info" bordered column={3}>
            <Descriptions.Item label="Request Id" span={3}>
                <EllipsisWrapper text={urlDetail.requestId} />
            </Descriptions.Item>
            <Descriptions.Item label="Dispatched Group Id" span={3}>
                {urlDetail.dispatchedGroupId}
            </Descriptions.Item>
            <Descriptions.Item label="Submitter" span={3}>
                {urlDetail.submitter}
            </Descriptions.Item>
            <Descriptions.Item label="Submitted Block Number" span={3}>
                {urlDetail.submittedBlkNum}
            </Descriptions.Item>
            <Descriptions.Item label="Submitted TxHash" span={3}>
                {urlDetail.submittedTxHash}
            </Descriptions.Item>
            <Descriptions.Item label="Message" span={3}>
                {urlDetail.message}
            </Descriptions.Item>
            <Descriptions.Item label="Signature" span={3}>
                {
                    urlDetail.signature && urlDetail.signature.map(Id => {
                        return <EllipsisWrapper key={Id} text={Id} />
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Publick Key" span={3}>
                {
                    urlDetail.pubKey && urlDetail.pubKey.map(Id => {
                        return <EllipsisWrapper key={Id} text={Id} />
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Data Source" span={3}>
                {urlDetail.dataSource}
            </Descriptions.Item>
            <Descriptions.Item label="Selector" span={3}>
                {urlDetail.selector}
            </Descriptions.Item>
            <Descriptions.Item label="TimeOut" span={3}>
                {urlDetail.timeOut}
            </Descriptions.Item>
            <Descriptions.Item label="Randomness" span={3}>
                {urlDetail.randomness}
            </Descriptions.Item>
            <Descriptions.Item label="Pass" span={3}>
                {`${urlDetail.pass}`}
            </Descriptions.Item>
        </Descriptions>
    )
}
