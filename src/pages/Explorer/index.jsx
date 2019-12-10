import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
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
        let { formatMessage: f } = this.props.intl;
        return (
            <div className="explorer-result--wrapper">
                <PageTitle title={() => (<><ExplorerIcon />&nbsp;{f({ id: 'Title.explorer' })}</>)}></PageTitle>
                <Search></Search>
            </div>
        )
    }
}

export default injectIntl(Explorer)
