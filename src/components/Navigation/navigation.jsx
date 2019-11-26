import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import './style.scss'
import { metaMaskLogin, metaMaskLogout } from '../../util/web3.js'
import {
    NodeListIcon,
    MyAccountIcon,
    ExplorerIcon,
    MetaMaskIcon
} from './icons.jsx'

export default class Navigation extends Component {
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
        let { userAddress = '', isMetaMaskLogin } = this.props.contract
        return (
            <div className="header__wrapper">
                <div className="header__container layout__container">
                    <div className="logo__wrapper">
                        <a href="/"><img src="/logo.png" className="logo--img" alt="logo" /></a>
                    </div>
                    <div className="navi__wrapper">
                        <div className="navi__container">
                            <NavLink className="navi-item" to={`/nodelist`} activeClassName="active"><NodeListIcon />&nbsp;Node List</NavLink>
                            <NavLink className="navi-item" to={`/explorer`} activeClassName="active"><ExplorerIcon />&nbsp;Explorer</NavLink>
                            <NavLink className="navi-item" to={`/myaccount`} activeClassName="active"><MyAccountIcon />&nbsp;My Account</NavLink>
                        </div>
                    </div>
                    <div className="dos-data--wrapper">
                        <div className="data-item">
                            <p className="data-title">Interest Rate</p>
                            <p className="data-text">0.95</p>
                        </div>
                        <div className="data-item">
                            <p className="data-title">NumberOfStakedToken</p>
                            <p className="data-text">12,345.67</p>
                        </div>
                        <div className="data-item">
                            <p className="data-title">PriceOfDOS</p>
                            <p className="data-text">1,111.004</p>
                        </div>
                    </div>
                    <div className="metamask__status__panel" >
                        <MetaMaskIcon />
                        {
                            isMetaMaskLogin ?
                                <div>
                                    <p>{`${userAddress.slice(0, 6)}...${userAddress.slice(-6)}`}</p>
                                    <p className="metamask__login-status--conntect" onClick={this.onMetaMaskLogout}>Connected</p>
                                </div>
                                :
                                <p className="metamask__login-button" onClick={this.onMetaMaskLogin}>Connect Wallet</p>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
