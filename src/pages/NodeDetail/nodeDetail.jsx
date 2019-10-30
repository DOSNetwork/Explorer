import React, { Component } from 'react'
import { Button } from 'antd'
import axios from 'axios';
import { getWeb3 } from '../../util/web3.js'
import './style.scss'
let web3;
export default class NodeDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            node: this.props.match.params.nodeId,
            nodeDetail: {},
            loading: false,
            userAddress: ''
        }
    }
    componentDidMount() {
        web3 = getWeb3()
        this.getNodeDetail()
        this.loadUser()
    }
    loadUser = () => {
        web3.eth.getAccounts().then((userAddress) => {
            if (userAddress && userAddress.length > 0) {
                this.setState({ userAddress: userAddress[0] })
            }
        })
    }
    getNodeDetail = () => {
        this.setState({
            loading: true
        })
        axios.get('/api/node/detail', { node: this.state.node }).then(response => {
            // 鬼...结构
            let data = response.data.body
            this.setState({
                nodeDetail: data.nodedetail,
                loading: false
            })
        })
    }
    render() {
        const { node, avatar, nodeAddress, nodeDescription, selfStaked, totalDelegated, rewardCut, totalRewards, uptime } = this.state.nodeDetail
        let isMetaMaskLogin = !!this.state.userAddress
        console.log(isMetaMaskLogin)
        let isUserDelegatedThisNode = false
        return (
            <div>
                <div className="node-detail--info">
                    <div className="info-avatar--wrapper">
                        <img src={avatar} alt="" />
                    </div>
                    <div className="info-summary--wrapper">
                        <p className="info-node">{node}</p>
                        {isMetaMaskLogin ?
                            <p className="info-opt">
                                <Button type="primary" shape="round" icon="solution" disabled={!isUserDelegatedThisNode}>
                                    Delegate
                            </Button>
                                <Button shape="round" icon="export" disabled={!isUserDelegatedThisNode}>
                                    Unbond
                            </Button>
                            </p> : null
                        }
                    </div>

                </div>
                <div className="node-detail--detail">
                    {
                        isMetaMaskLogin ?
                            <div className="detail--user-info">
                                <div className="user-info--delegation">
                                    <p className="user-info--title">My Delegation</p>
                                    <p className="user-info--value">{totalDelegated}</p>
                                </div>
                                <div className="user-info--rewards">
                                    <p className="user-info--title">My Rewards</p>
                                    <p className="user-info--value">{totalRewards}</p>
                                    <Button className="widthdraw-button" shape="round" icon="dollar" disabled={!isUserDelegatedThisNode}>
                                        Withdraw Reward
                            </Button>
                                </div>
                            </div> : null
                    }
                    <div className="node-detail--item">
                        <div className="item--title">Node Address</div>
                        <div className="item--value">{nodeAddress}</div>
                    </div>
                    <div className="node-detail--item">
                        <div className="item--title">Node Description</div>
                        <div className="item--value">{nodeDescription}</div>
                    </div>
                    <div className="node-detail--item">
                        <div className="item--title">Node Selt-Staked</div>
                        <div className="item--value">{selfStaked}</div>
                    </div>
                    <div className="node-detail--item">
                        <div className="item--title">Total Delegated</div>
                        <div className="item--value">{totalDelegated}</div>
                    </div>
                    <div className="node-detail--item">
                        <div className="item--title">Reward Cut</div>
                        <div className="item--value">{rewardCut}%</div>
                    </div>
                    <div className="node-detail--item">
                        <div className="item--title">Uptime</div>
                        <div className="item--value">{uptime} days</div>
                    </div>
                </div>
            </div>
        )
    }
}
