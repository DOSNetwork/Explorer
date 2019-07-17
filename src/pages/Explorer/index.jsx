import React, { Component } from 'react'
import { PageTitle } from '../../Layout/page'
import './style.scss';
import Search from './searchContainer'
import PropTypes from 'prop-types';
class Explorer extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    render() {
        return (
            <div className="explorer-result--wrapper">
                <PageTitle title="Explorer" />
                <Search></Search>
            </div>
        )
    }
}

export default Explorer
