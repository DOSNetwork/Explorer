import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navigation from "./components/Navigation/navigationContainer";
import MyAccount from "./pages/MyAccount";
import NodeList from "./pages/NodeList";
import NodeDetail from "./pages/NodeDetail";
import NotFound404 from "./pages/NotFound404";
import Explorer from "./pages/Explorer";
import Layout from "./Layout";
import { connectMetaMask } from "./util/web3.js";
import { DOS_ABI, DOS_CONTRACT_ADDRESS } from "./util/const";
import { message } from "antd";
import store from './redux/store'
message.config({
  top: 100,
  maxCount: 3
});
class App extends Component {
  componentWillMount() {
    const web3Client = connectMetaMask();
    let contractInstance = new web3Client.eth.Contract(
      DOS_ABI,
      DOS_CONTRACT_ADDRESS
    );
    async function loadNodes() {
      // export的userAddress会一直是空的
      let { userAddress } = store.getState().contract;
      let nodesAddrs = Array.from(
        await contractInstance.methods.getNodeAddrs().call()
      );

      for (let i = 0; i < nodesAddrs.length; i++) {
        // 已经保存过的不重复保存
        let nodeAddr = nodesAddrs[i]
        // if (!localStorage.getItem(nodeAddr)) {
        let node = await contractInstance.methods.nodes(nodeAddr).call();
        localStorage.setItem(nodeAddr, JSON.stringify(node));
        // }
        let delegatorKey = nodeAddr + userAddress
        if (userAddress !== "") {
          // if (!localStorage.getItem(delegatorKey)) {
          let delegator = await contractInstance.methods
            .delegators(userAddress, nodeAddr)
            .call();
          localStorage.setItem(
            delegatorKey,
            JSON.stringify(delegator)
          );
          // }
        }
      }
    }
    loadNodes();
    setInterval(() => {
      loadNodes();
    }, 15000);
  }
  render() {
    return (
      <Router>
        <Layout>
          <Navigation></Navigation>
          <Switch>
            <Route exact path="/" component={NodeList} />
            <Route path="/nodelist" component={NodeList} />
            <Route path="/explorer" component={Explorer} />
            {/* <Route path="/home" component={HomePage} /> */}
            {/* <Route path="/ajax" component={AjaxDemo} />
            <Route path="/redux" component={ReduxDemo} />
            <Route path="/echart" component={EchartDemo} />
            <Route path='/router' component={RouterDemo} /> */}
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
