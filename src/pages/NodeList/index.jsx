import React, { Component } from 'react'
import { PageTitle } from '../../Layout/page'
import NodeListContainer from './nodeListContainer'
import './style.scss'
export default class NodeList extends Component {
    render() {
        return (
            <div>
                <PageTitle title='Node List'></PageTitle>
                <NodeListContainer></NodeListContainer>
            </div>
        )
    }
}
