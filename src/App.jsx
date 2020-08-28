import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Navigation from "./components/Navigation/navigationContainer";
import MyAccount from "./pages/MyAccount";
import NodeList from "./pages/NodeList";
import NodeDetail from "./pages/NodeDetail";
import NotFound404 from "./pages/NotFound404";
import Explorer from "./pages/Explorer";
import Layout from "./Layout";
import { message } from "antd";
import store from './redux/store'
// import { connectToClient } from "./util/web3.js";

message.config({
  top: 100,
  maxCount: 3
});
class App extends Component {
  componentDidMount() {
    let { stakingContract, networkSupported } = store.getState().contract;
    if (networkSupported) {
      async function loadNodes() {
        try {
          let { userAddress, } = store.getState().contract;
          let nodesAddrs = Array.from(
            await stakingContract.methods.getNodeAddrs().call()
          );
          for (let i = 0; i < nodesAddrs.length; i++) {
            // 已经保存过的不重复保存
            let nodeAddr = nodesAddrs[i]
            let node = await stakingContract.methods.nodes(nodeAddr).call();
            localStorage.setItem(nodeAddr, JSON.stringify(node));
            let delegatorKey = nodeAddr + userAddress
            if (userAddress !== "") {
              let delegator = await stakingContract.methods
                .delegators(userAddress, nodeAddr)
                .call();
              localStorage.setItem(
                delegatorKey,
                JSON.stringify(delegator)
              );
            }
          }
        } catch (e) {
          console.log('error' + e)
          // message.error(e);
        }
      }
      loadNodes();
      setInterval(() => {
        loadNodes();
      }, 15000);
    }
  }

  render() {
    return (
      <Router>
        <Layout>
          <Navigation></Navigation>
          <Switch>
            <Route exact path="/" render={() => (
              < Redirect to="/explorer" />
            )} />
            <Route path="/staking" component={NodeList} />
            <Route path="/explorer" component={Explorer} />
            <Route path="/nodedetail/:nodeId" component={NodeDetail} />
            <Route path="/myaccount" component={MyAccount} />
            <Route component={NotFound404} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
