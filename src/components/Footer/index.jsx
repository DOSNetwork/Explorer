import React, { PureComponent } from 'react'
const links = [
    {
        title: 'Useful Links',
        subLinks: [
            {
                text: '> Main Website',
                url: 'https://dos.network'
            }, {
                text: '> Github',
                url: 'https://github.com/DOSNetwork'
            }, {
                text: '> Documentations',
                url: 'https://dosnetwork.github.io/docs/#/contents/blockchains/ethereum'
            }, {
                text: '> Token Swap Bridge',
                url: 'https://swap.dos.network'
            }
        ]
    }
]

export default class Footer extends PureComponent {
    render() {
        let renderLinks = links.map((link) => {
            let renderSubLinks = link.subLinks.map((sublink) => {
                return (
                    <div className="link" key={sublink.text}><a href={sublink.url}>{sublink.text}</a></div>
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
