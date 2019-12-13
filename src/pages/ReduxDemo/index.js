import React, { Component } from 'react';
import store from '../../redux/store'
class ReduxDemo extends Component {
    constructor(props) {
        super(props)
        this.countClick = this.countClick.bind(this)
        this.countRerender = this.countRerender.bind(this)
        this.state = (store.getState())
        store.subscribe(this.countRerender)
    }
    componentDidMount() {
        store.dispatch({ type: 'LOADING_STATUS', loading: true })
    }
    componentWillUnmount() {
        // console.log(store)
    }
    countClick() {
        store.dispatch({ type: 'COUNTING' })
    }
    countRerender() {
        // console.log(`store.subscribe function called`)
        let state = store.getState()
        // console.log(state)
        this.setState(state)
    }
    render() {
        return (
            <div>
                <p>Redux Demo</p>
                <p>Count:{this.state.app.count}</p>
                <button onClick={this.countClick}>+1</button>
            </div>
        )
    }
}

export default ReduxDemo
