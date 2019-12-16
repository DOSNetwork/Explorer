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

// import { DOS_ABI, DOS_CONTRACT_ADDRESS } from "./util/const";
import { message } from "antd";
import store from './redux/store'
message.config({
  top: 100,
  maxCount: 3
});
class App extends Component {
  componentWillMount() {
    // export的userAddress会一直是空的
    let { dosContract: contractInstance, networkSupported } = store.getState().contract;
    if (networkSupported) {
      async function loadNodes() {
        // export的userAddress会一直是空的
        let { userAddress, } = store.getState().contract;
        let nodesAddrs = Array.from(
          await contractInstance.methods.getNodeAddrs().call()
        );
        for (let i = 0; i < nodesAddrs.length; i++) {
          // 已经保存过的不重复保存
          let nodeAddr = nodesAddrs[i]
          let node = await contractInstance.methods.nodes(nodeAddr).call();
          localStorage.setItem(nodeAddr, JSON.stringify(node));
          let delegatorKey = nodeAddr + userAddress
          if (userAddress !== "") {
            let delegator = await contractInstance.methods
              .delegators(userAddress, nodeAddr)
              .call();
            localStorage.setItem(
              delegatorKey,
              JSON.stringify(delegator)
            );
          }
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
            <Route path="/nodelist" component={NodeList} />
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
