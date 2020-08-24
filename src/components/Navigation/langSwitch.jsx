import React from 'react'
export default function LangSwitch(props) {
    let { formatMessage: f } = props.intl;
    let { lang } = props.global
    return (
        <div className="change-lang-button" onClick={() => { props.changeLang(lang === 'zh-CN' ? 'en-US' : 'zh-CN') }}>
            <span className="change-lang--switch">{f({ id: 'ChangeLang-Current' })}</span>
            {f({ id: 'ChangeLang' })}
        </div>
    )
}
