import React, { PureComponent } from 'react'
import { injectIntl } from 'react-intl'
import reddit from './soical-icons/reddit.png'
import wechat from './soical-icons/wechat.png'
import twitter from './soical-icons/twitter.png'
import medium from './soical-icons/medium.png'
import github from './soical-icons/github.png'
import telegram from './soical-icons/telegram.png'
const socialLinks = [
    {
        icon: telegram,
        url: 'https://t.me/dosnetwork_en'
    }, {
        icon: wechat,
        url: 'https://dos.network/#qrcodeModal'
    }, {
        icon: medium,
        url: 'https://medium.com/dos-network'
    }, {
        icon: github,
        url: 'https://github.com/DOSNetwork'
    }, {
        icon: twitter,
        url: 'https://twitter.com/DosNetwork'
    }, {
        icon: reddit,
        url: 'https://www.reddit.com/r/DOSNetwork'
    }
]
const links = [
    {
        text: 'Main Website',
        url: 'https://dos.network'
    }, {
        text: 'Github',
        url: 'https://github.com/DOSNetwork'
    }, {
        text: 'Documentations',
        url: 'https://dosnetwork.github.io/docs/#/contents/blockchains/ethereum'
    }, {
        text: 'Token Swap Bridge',
        url: 'https://swap.dos.network'
    }
]

class Footer extends PureComponent {
    render() {
        // let { formatMessage: f } = this.props.intl;     
        let renderSoicalLinks = () => {
            let linkItem = socialLinks.map(link => {
                return (
                    <div className="link" key={link.url}><a href={link.url}><img src={link.icon} alt={link.url} /></a></div>
                )
            })
            return (
                <div className="social-link--wrapper">
                    {linkItem}
                </div>
            )
        }
        let renderLinks = () => {
            let linkItem = links.map((link) => {
                return (
                    <div className="link" key={link.text}><a href={link.url}>{link.text}</a></div>
                )
            })
            return (
                <div className="document-link--wrapper">
                    {linkItem}

                </div>
            )
        }
        return (
            <div className="footer__wrapper">
                <div className="footer__container">
                    {renderSoicalLinks()}
                    {renderLinks()}
                    <div className="copy-right">
                        © Copyright 2019 DOS Foundation Ltd. All Rights Reserved
                    </div>
                </div>
            </div>
        )
    }
}

export default injectIntl(Footer)
