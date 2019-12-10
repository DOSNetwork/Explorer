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
import { connectMetaMask, USERADDRESS } from "./util/web3.js";
import { DOS_ABI, DOS_CONTRACT_ADDRESS } from "./util/const";
import { message } from "antd";
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
      let nodesAddrs = Array.from(
        await contractInstance.methods.getNodeAddrs().call()
      );
      for (let i = 0; i < nodesAddrs.length; i++) {
        let node = await contractInstance.methods.nodes(nodesAddrs[i]).call();
        localStorage.setItem(nodesAddrs[i], JSON.stringify(node));
        if (USERADDRESS != "") {
          let delegator = await contractInstance.methods
            .delegators(USERADDRESS, nodesAddrs[i])
            .call();
          localStorage.setItem(
            nodesAddrs[i] + USERADDRESS,
            JSON.stringify(delegator)
          );
        }
      }
    }
    loadNodes();
    setInterval(() => {
      loadNodes();
      console.log("app timeout");
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
