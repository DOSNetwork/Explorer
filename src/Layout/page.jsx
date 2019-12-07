import React from 'react'

export function PageTitle(props) {
    let { title } = props
    return <div className="page-title">
              { typeof title ==='function'?title():title}
    </div>
}

export function SubTitle(props) {
    let { title } = props
    return <div className="page-sub-title">
         { typeof title ==='function'?title():title}
    </div>
}
