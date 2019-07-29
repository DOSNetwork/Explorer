import React from 'react'
import { Descriptions, Icon, Typography } from 'antd'
const { Paragraph } = Typography;
export const UrlDetail = ({ url }) => {
    let urlDetail = (url && url[0]) || {
        requestId: 'NOT FOUND',
        signature: [],
        pubKey: []
    }
    return (
        <Descriptions title="Request Info" bordered column={3}>
            <Descriptions.Item label="Request Id" span={3}>
                <Paragraph copyable={{ text: urlDetail.requestId }}>
                    {urlDetail.requestId}
                </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Dispatched Group Id" span={3}>
                {urlDetail.dispatchedGroupId}
            </Descriptions.Item>
            <Descriptions.Item label="Submitter" span={2}>
                {urlDetail.submitter}
            </Descriptions.Item>
            <Descriptions.Item label="Submitted Block Number">
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
                    urlDetail.signature.map(item => {
                        return <p key={item} className='nodes-item' ><Icon style={{ fontSize: 13 }} type="tag" /> - {item}</p>
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Publick Key" span={3}>
                {
                    urlDetail.pubKey.map(Id => {
                        return <p key={Id} className='nodes-item' ><Icon style={{ fontSize: 13 }} type="tag" /> - {Id}</p>
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Pass">
                {`${urlDetail.pass}`}
            </Descriptions.Item>
            <Descriptions.Item label="TimeOut">
                {urlDetail.timeOut}
            </Descriptions.Item>
            <Descriptions.Item label="Selector">
                {urlDetail.selector}
            </Descriptions.Item>
            <Descriptions.Item label="Data Source">
                {urlDetail.dataSource}
            </Descriptions.Item>
            <Descriptions.Item label="Randomness">
                {urlDetail.randomness}
            </Descriptions.Item>
        </Descriptions>
    )
}
