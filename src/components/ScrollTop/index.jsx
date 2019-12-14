import React, { Component } from 'react'
import { Icon } from 'antd'
import './style.scss'

let throttleTimer = null
let lastShowStatus
export default class ScrollTop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scrollTopShow: false,
            throttleTimer: null
        }
    }
    handleScrolling() {
        let scrollTop = document.documentElement.scrollTop
        if (scrollTop > 800 && !this.state.scrollTopShow) {
            this.toggleScrollTop(true)
        }
        if (scrollTop < 800 && this.state.scrollTopShow) {
            this.toggleScrollTop(false)
        }
    }
    toggleScrollTop(status) {
        // let { scrollTopShow } = this.state
        if (status !== lastShowStatus) {
            if (throttleTimer) {
                clearTimeout(throttleTimer)
                throttleTimer = null
            }
            lastShowStatus = status
            throttleTimer = setTimeout(() => {
                this.setState({
                    scrollTopShow: status
                })
            }, 1000)
        }
    }
    scrollTop() {
        window.scroll(0, 0)
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScrolling.bind(this))
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScrolling.bind(this))
    }
    render() {
        let { scrollTopShow } = this.state
        return (
            <>
                <div onClick={this.scrollTop} className={[`scroll-top__wrapper ${scrollTopShow ? "display" : ''}`]}>
                    <Icon style={{ fontSize: 60 }} type="up-circle" />
                </div>
            </>
        )
    }
}
