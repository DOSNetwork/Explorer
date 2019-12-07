import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navigation from './components/Navigation/navigationContainer'
import MyAccount from './pages/MyAccount'
import NodeList from './pages/NodeList'
import NodeDetail from './pages/NodeDetail'
import NotFound404 from './pages/NotFound404'
import Explorer from './pages/Explorer'
import Layout from './Layout'
import { connectMetaMask } from './util/web3.js'
import { message } from 'antd'
message.config({
  top: 100,
  maxCount: 3,
});
class App extends Component {
  componentWillMount() {
    connectMetaMask()
  }
  render() {
    return (
      <Router>
        <Layout>
          <Navigation>
          </Navigation>
          <Switch>
            <Route exact path='/' component={NodeList} />
            <Route path='/nodelist' component={NodeList} />
            <Route path='/explorer' component={Explorer} />
            {/* <Route path="/home" component={HomePage} /> */}
            {/* <Route path="/ajax" component={AjaxDemo} />
            <Route path="/redux" component={ReduxDemo} />
            <Route path="/echart" component={EchartDemo} />
            <Route path='/router' component={RouterDemo} /> */}
            <Route path='/nodedetail/:nodeId' component={NodeDetail} />
            <Route path='/myaccount' component={MyAccount} />
            <Route component={NotFound404} />
          </Switch>
        </Layout>
      </Router>
    )
  }
}

export default App;
