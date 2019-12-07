import React, { Component } from 'react'
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
                <PageTitle title={() => (<><NodeListIcon style={{ color: '#2F2769' }} />&nbsp;Node List</>)}></PageTitle>
                <NodeListContainer></NodeListContainer>
            </div>
        )
    }
}
