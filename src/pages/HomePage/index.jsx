import React, { Component } from 'react'
import cssModule from '../../test.module.css'
import logo from './logo.svg';

class HomePage extends Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(e) {
        let target = e.target
        console.log(`first event loop`, e, `the target `, target)

        let p = new Promise(function (rs) {
            rs('a')
        })
        p.then(() => {
            // 合成事件只对当前event loop 有效
            console.log(`next event loop`, e, `the target from first loop `, target)
        })
        console.log(`find Dom El by refs= `, this.refs.refDemoEl)
    }
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Edit <code>src/App.js</code> and save to reload.</p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >Learn React</a>
                <span className={cssModule.blue}>this is color-blue css module</span>
                <div className={cssModule.flex}>
                    <p>this is flex layout,</p>
                    <p>flex!!!!</p>
                </div>
                <div ref='refDemoEl' onClick={this.handleClick} className={[cssModule.flex, cssModule.blue].join(' ')}>{process.env.REACT_APP_ENV_VAR_A}</div>
            </header>

        )
    }
}


export default HomePage;
