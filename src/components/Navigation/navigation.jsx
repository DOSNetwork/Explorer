import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import './style.scss'
import { walletLogin, walletLogout } from '../../util/web3.js'
import { Modal } from 'antd'
import {
    NodeListIcon,
    MyAccountIcon,
    ExplorerIcon,
    WalletIcon
} from '../SvgIcon/icons.jsx'
const Navigation = class Navigation extends Component {
    onMetaMaskLogin = () => {
        let { formatMessage: f } = this.props.intl
        let { isWalletLogin } = this.props.contract
        if (!isWalletLogin) {
            walletLogin().then((isWalletInstalled) => {
                if (!isWalletInstalled) {
                    Modal.info({
                        title: f({ id: 'Wallet.Title.NoWalletInstalled' }),
                        content: f({ id: 'Wallet.Tips.InstallWallet' }),
                    })
                }
            })
        }
    }
    onMetaMaskLogout = () => {
        let { isWalletLogin } = this.props.contract
        if (isWalletLogin) {
            walletLogout()
        }
    }
    render() {
        let { userAddress = '', isWalletLogin } = this.props.contract;
        let { formatMessage: f } = this.props.intl;
        return (
            <div className="header__wrapper">
                <div className="header__container layout__container">
                    <div className="logo__wrapper">
                        <NavLink to={'/'}>
                            <img src="/logo.png" className="logo--img" alt="logo" />
                        </NavLink>
                    </div>
                    <div className="navi__wrapper">
                        <div className="navi__container">
                            <NavLink className="navi-item" to={`/explorer`} activeClassName="active"><ExplorerIcon />&nbsp;{f({ id: 'Title.explorer' })}</NavLink>
                            <NavLink className="navi-item" to={`/nodelist`} activeClassName="active"><NodeListIcon />&nbsp;{f({ id: 'Title.nodelist' })}</NavLink>
                            <NavLink className="navi-item" to={`/myaccount`} activeClassName="active"><MyAccountIcon />&nbsp;{f({ id: 'Title.myaccount' })}</NavLink>
                        </div>
                    </div>
                    <div className="wallet__status__panel" >
                        <WalletIcon />
                        {
                            isWalletLogin ?
                                <div>
                                    <p>{`${userAddress.slice(0, 6)}...${userAddress.slice(-6)}`}</p>
                                    <p className="wallet__login-status--conntect" onClick={this.onMetaMaskLogout}>{f({ id: 'Wallet.connected' })}</p>
                                </div>
                                :
                                <p className="wallet__login-button" onClick={this.onMetaMaskLogin}>{f({ id: 'Wallet.connectwallet' })}</p>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default injectIntl(Navigation)
