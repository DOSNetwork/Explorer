import React, { Component } from 'react'
import { PageTitle } from '../../Layout/page'
import './style.scss';
import Search from './searchContainer'
export default class Explorer extends Component {
    render() {
        return (
            <div className="explorer-result--wrapper">
                <PageTitle title="Explorer" />
                <Search></Search>
            </div>
        )
    }
}
