import React, { Component } from 'react';
import axios from 'axios'
class AjaxDemo extends Component {
    constructor(props) {
        super(props)
        this.getDatafromAjax = this.getDatafromAjax.bind(this)
        this.state = {
            text: '',
            code: 0,
            message: ''
        }
    }
    getDatafromAjax() {
        axios.get('/api/demo/getdata').then(data => {
            // 鬼...结构
            let response = data.data
            let body = response.body
            let code = response.code
            let message = response.message
            this.setState({
                text: body.text,
                code: code,
                message: message
            })
        })
    }
    componentDidMount() {
        this.getDatafromAjax()
    }
    render() {
        return (
            <div className="ajax-demo--wrapper">response from Ajax: /api/demo/getdata
            <p>text:{this.state.text}</p>
                <p>code:{this.state.code}</p>
                <p>message:{this.state.message}</p></div>
        )
    }
}

export default AjaxDemo
