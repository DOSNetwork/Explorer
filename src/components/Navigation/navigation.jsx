import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './style.scss'
import { connectMetaMask } from '../../util/web3.js'
export default class Navigation extends Component {
    onMetaMaskLogin = () => {
        let { isMetaMaskLogin } = this.props.contract
        if (!isMetaMaskLogin) {
            connectMetaMask()
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
                            <NavLink className="navi-item" to={`/explorer`} activeClassName="active">Explorer</NavLink>
                            <NavLink className="navi-item" to={`/nodelist`} activeClassName="active">Node List</NavLink>
                            <NavLink className="navi-item" to={`/myaccount`} activeClassName="active">My Account</NavLink>
                        </div>
                    </div>
                    <div className="metamask__status__panel" >
                        <img className="metamask__logo" src="/metamask.jpeg" alt="METAMASK" />
                        {
                            isMetaMaskLogin ? <p>{`${userAddress.slice(0, 10)}...`}</p> : <p className="metamask__login-button" onClick={this.onMetaMaskLogin}>LOGIN</p>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
