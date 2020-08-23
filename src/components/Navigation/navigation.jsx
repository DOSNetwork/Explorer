import React from 'react'
import { NavLink } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import './style.scss'
import Wallet from './wallet'
import {
    NodeListIcon,
    MyAccountIcon,
    ExplorerIcon
} from '../SvgIcon/icons.jsx'

function Navigation(props) {
    console.log('NavigationComponent render')
    let { formatMessage: f } = props.intl;
    let { lang } = props.global
    return (
        <div className="header__wrapper">
            <div className="header__container layout__container">
                <div className="logo__wrapper">
                    <NavLink to={'/'}>
                        <span className='logo--img'></span>
                        {/* <img src="/logo.png" className="logo--img" alt="logo" /> */}
                    </NavLink>
                </div>
                <div className="navi__wrapper">
                    <div className="navi__container">
                        <NavLink className="navi-item" to={`/explorer`} activeClassName="active"><ExplorerIcon />&nbsp;<span className='navi-item--title'>{f({ id: 'Title.explorer' })}</span></NavLink>
                        <NavLink className="navi-item" to={`/staking`} activeClassName="active"><NodeListIcon />&nbsp;<span className='navi-item--title'>{f({ id: 'Title.staking' })}</span></NavLink>
                        <NavLink className="navi-item" to={`/myaccount`} activeClassName="active"><MyAccountIcon />&nbsp;<span className='navi-item--title'>{f({ id: 'Title.myaccount' })}</span></NavLink>
                    </div>
                </div>
                <div className="change-lang-button" onClick={() => { props.changeLang(lang === 'zh-CN' ? 'en-US' : 'zh-CN') }}>{f({ id: 'ChangeLang' })}</div>
                <Wallet />
            </div>
        </div>
    )
}

export default injectIntl(Navigation)
