import React, { Component } from 'react'
import { PageTitle } from '../../Layout/page'
import './style.scss';
import Search from './searchContainer'
import {
    ExplorerIcon,
} from '../../components/SvgIcon/icons.jsx'
import PropTypes from 'prop-types';
class Explorer extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    render() {
        return (
            <div className="explorer-result--wrapper">
                <PageTitle title={()=>(<><ExplorerIcon/>&nbsp;Network Explorer</>)}></PageTitle>
                <Search></Search>
            </div>
        )
    }
}

export default Explorer
