import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { PageTitle } from '../../Layout/page'
import NodeListContainer from './nodeListContainer'
import {
    NodeListIcon,
} from '../../components/SvgIcon/icons.jsx'
import './style.scss'
export default class NodeList extends Component {
    render() {
        return (
            <div>
                <PageTitle title={() => (<><NodeListIcon style={{ color: '#2F2769' }} />&nbsp;<FormattedMessage id='Title.nodelist' /></>)}></PageTitle>
                <NodeListContainer></NodeListContainer>
            </div>
        )
    }
}
