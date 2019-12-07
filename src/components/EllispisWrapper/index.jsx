import React from 'react'
import { Link } from "react-router-dom";
import { Typography } from 'antd'
import { EllipsisString } from '../../util/util'
const { Paragraph } = Typography;

export default function EllipsisWrapper(props) {
    let showLink = !!props.link
    return <div className='ellipsis--wrapper' >
        <div className="ellipsis--border">
            {showLink ?
                <>
                    <Link className="link-column-text" to={props.link}>{EllipsisString(props.text, 6, 6)}</Link>
                    <Paragraph style={{ color: '#358ED7' }} copyable={{ text: props.text }}></Paragraph>
                </> :
                <Paragraph style={{ color: '#358ED7' }} copyable={{ text: props.text }}>
                    {EllipsisString(props.text, 6, 6)}
                </Paragraph>
            }
        </div>
    </div>
}
