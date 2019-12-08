import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import './style.scss'
import { metaMaskLogin, metaMaskLogout } from '../../util/web3.js'
import {
    NodeListIcon,
    MyAccountIcon,
    ExplorerIcon,
    MetaMaskIcon
} from '../SvgIcon/icons.jsx'
const Navigation = class Navigation extends Component {
    componentWillMount() {
        console.log(this.props.intl)
    }
    onMetaMaskLogin = () => {
        let { isMetaMaskLogin } = this.props.contract
        if (!isMetaMaskLogin) {
            metaMaskLogin()
        }
    }
    onMetaMaskLogout = () => {
        let { isMetaMaskLogin } = this.props.contract
        if (isMetaMaskLogin) {
            metaMaskLogout()
        }
    }
    render() {
        let { userAddress = '', isMetaMaskLogin } = this.props.contract;
        let { formatMessage: f } = this.props.intl;
        return (
            <div className="header__wrapper">
                <div className="header__container layout__container">
                    <div className="logo__wrapper">
                        <a href="/"><img src="/logo.png" className="logo--img" alt="logo" /></a>
                    </div>
                    <div className="navi__wrapper">
                        <div className="navi__container">
                            <NavLink className="navi-item" to={`/nodelist`} activeClassName="active"><NodeListIcon />&nbsp;{f({ id: 'Title.nodelist' })}</NavLink>
                            <NavLink className="navi-item" to={`/explorer`} activeClassName="active"><ExplorerIcon />&nbsp;{f({ id: 'Title.explorer' })}</NavLink>
                            <NavLink className="navi-item" to={`/myaccount`} activeClassName="active"><MyAccountIcon />&nbsp;{f({ id: 'Title.myaccount' })}</NavLink>
                        </div>
                    </div>
                    <div className="metamask__status__panel" >
                        <MetaMaskIcon />
                        {
                            isMetaMaskLogin ?
                                <div>
                                    <p>{`${userAddress.slice(0, 6)}...${userAddress.slice(-6)}`}</p>
                                    <p className="metamask__login-status--conntect" onClick={this.onMetaMaskLogout}>{f({ id: 'MetaMask.connected' })}</p>
                                </div>
                                :
                                <p className="metamask__login-button" onClick={this.onMetaMaskLogin}>{f({ id: 'MetaMask.connectwallet' })}</p>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default injectIntl(Navigation)
