import React from 'react'
import { Descriptions } from 'antd'
import EllipsisWrapper from '../../components/EllispisWrapper'

export const AddressDetail = ({ address, f }) => {
    let addressDetail = (address && address[0]) || {
        addr: 'NOT FOUND',
        activeGroups: []
    }
    return (
        <Descriptions title={f({ id: 'Table.Column.Explorer.Address' })} bordered column={3}>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.Address' })} span={3}>
                <EllipsisWrapper text={addressDetail.addr} />
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.Balance' })} span={3}>
                {addressDetail.balance}
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.RegisterState' })} span={3}>
                {`${addressDetail.registerState}`}
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.ActiveGroups' })} span={3}>
                {
                    addressDetail.activeGroups && addressDetail.activeGroups.map(Id => {
                        return <EllipsisWrapper key={Id} text={Id} />
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item label={f({ id: 'Table.Column.Explorer.ExpiredGroups' })} span={3}>
                {addressDetail.expiredGroups}
            </Descriptions.Item>

        </Descriptions>
    )
}
