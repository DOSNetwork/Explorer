import React, { Component } from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navigation from './components/Navigation'
import AjaxDemo from './pages/AjaxDemo'
import ReduxDemo from './pages/ReduxDemo'
import HomePage from './pages/HomePage'
import EchartDemo from './pages/EchartDemo'
import RouterDemo from './pages/RouterDemo'
import NotFound404 from './pages/NotFound404'
import Explorer from './pages/Explorer'
import NodeList from './pages/NodeList'
import Layout from './Layout'
class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Navigation>
          </Navigation>
          <Switch>
            <Route path="/home" component={HomePage} />
            <Route path="/ajax" component={AjaxDemo} />
            <Route path="/redux" component={ReduxDemo} />
            <Route path="/echart" component={EchartDemo} />
            <Route path='/router' component={RouterDemo} />
            <Route path='/explorer' component={Explorer} />
            <Route path='/nodelist' component={NodeList} />
            <Route component={NotFound404} />
          </Switch>
        </Layout>
      </Router>
    )
  }
}

export default App;
