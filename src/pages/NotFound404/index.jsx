import React, { Component } from 'react'
import css from './style.module.scss'
export default class NotFound404 extends Component {
    render() {
        // console.log(css)
        return (
            <div>
                <div className={css.page_404}>
                    Ops! Page Not Found
                </div>
            </div>
        )
    }
}
