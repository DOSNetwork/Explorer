import React, { PureComponent } from 'react'
const links = [
    {
        title: 'Useful Link',
        subLinks: [
            {
                text: 'How it works',
                url: 'https://www.baidu.com'
            }, {
                text: 'Token sale details',
                url: 'https://www.baidu.com'
            }, {
                text: 'Team',
                url: '/nodelist'
            }
        ]
    }, {
        title: 'Documents',
        subLinks: [
            {
                text: 'Privacy Policy',
                url: 'https://www.baidu.com'
            }, {
                text: 'Terms of Use',
                url: 'https://www.baidu.com'
            }, {
                text: 'Agreement',
                url: '/nodelist'
            }
        ]
    }
]

export default class Footer extends PureComponent {
    render() {
        let renderLinks = links.map((link) => {
            let renderSubLinks = link.subLinks.map((sublink) => {
                return (
                    <div className="link" key={sublink.text}>{sublink.text}</div>
                )
            })
            return (
                <div className="link-group-item" key={link.title}>
                    <div className="link-group-title">{link.title}</div>
                    <div className="link-group-sub">
                        {renderSubLinks}
                    </div>
                </div>
            )
        })
        return (
            <div className="footer__wrapper">
                <div className="link-group">
                    {renderLinks}
                </div>
            </div>
        )
    }
}
