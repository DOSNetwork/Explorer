import React from 'react'
import { Descriptions } from 'antd'
import EllipsisWrapper from '../../components/EllispisWrapper'

export const AddressDetail = ({ address }) => {
    let addressDetail = (address && address[0]) || {
        addr: 'NOT FOUND',
        activeGroups: []
    }
    return (
        <Descriptions title="Address Info" bordered column={3}>
            <Descriptions.Item label="Address" span={3}>
                <EllipsisWrapper text={addressDetail.addr} />
            </Descriptions.Item>
            <Descriptions.Item label="Balance" span={3}>
                {addressDetail.balance}
            </Descriptions.Item>
            <Descriptions.Item label="Register State" span={3}>
                {`${addressDetail.registerState}`}
            </Descriptions.Item>
            <Descriptions.Item label="Active Groups" span={3}>
                {
                    addressDetail.activeGroups && addressDetail.activeGroups.map(Id => {
                        return <EllipsisWrapper key={Id} text={Id} />
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label="Expired Groups" span={3}>
                {addressDetail.expiredGroups}
            </Descriptions.Item>

        </Descriptions>
    )
}
