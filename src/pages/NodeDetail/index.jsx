import React, { Component } from 'react'
import { PageTitle } from '../../Layout/page'
import NodeDetailContainer from './nodeDetailContainer'
import {
    NodeListIcon,
} from '../../components/SvgIcon/icons.jsx'
import './style.scss'
export default class NodeDetail extends Component {
    render() {
        return (
            <div>
                <PageTitle title={()=>(<><NodeListIcon/>&nbsp;Node Detail</>)}></PageTitle>
                <NodeDetailContainer {...this.props}></NodeDetailContainer>
            </div>
        )
    }
}
