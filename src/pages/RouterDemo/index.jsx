import React, { Component } from 'react'
import { Route } from "react-router-dom";
import EchartDemo from '../EchartDemo'
class RouterDemo extends Component {
    render() {
        return (
            <div>
                <h1>this is nested router</h1>
                <div>
                    <Route path="/router/chart" component={EchartDemo} />
                </div>
            </div>
        )
    }
}

export default RouterDemo
