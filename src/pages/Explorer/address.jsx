import React from 'react'
import { Descriptions, Icon, Typography } from 'antd'
const { Paragraph } = Typography;
export const AddressDetail = ({ address }) => {
    let addressDetail = (address && address[0]) || {
        addr: 'NOT FOUND',
        activeGroups: []
    }
    return (
        <Descriptions title="Address Info" bordered column={3}>
            <Descriptions.Item label="Address" span={3}>
                <Paragraph copyable={{ text: addressDetail.addr }}>
                    {addressDetail.addr}
                </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Balance">
                {addressDetail.balance}
            </Descriptions.Item>
            <Descriptions.Item label="Register State">
                {`${addressDetail.registerState}`}
            </Descriptions.Item>
            <Descriptions.Item label="expiredGroups">
                {addressDetail.expiredGroups}
            </Descriptions.Item>
            <Descriptions.Item label="Active Groups" span={3}>
                {
                    addressDetail.activeGroups && addressDetail.activeGroups.map(Id => {
                        return <p key={Id} className='nodes-item' ><Icon style={{ fontSize: 13 }} type="tag" /> - {Id}</p>
                    })
                }
            </Descriptions.Item>

        </Descriptions>
    )
}
