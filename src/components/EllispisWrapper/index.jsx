import React from 'react'
import { Typography } from 'antd'
import { EllipsisString } from '../../util/util'
const { Paragraph } = Typography;

export default function EllipsisWrapper(props) {
    return <div className='ellipsis--wrapper' >
        <div className="ellipsis--border">
            <Paragraph copyable={{ text: props.text }}>
                {EllipsisString(props.text, 6, 6)}
            </Paragraph>
        </div>
    </div>
}
