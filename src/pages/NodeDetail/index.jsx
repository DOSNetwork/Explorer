import React, { Component } from 'react'
import { Button } from 'antd'
import { PageTitle } from '../../Layout/page'
import axios from 'axios';
import './style.scss'
export default class NodeDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            node: this.props.match.params.nodeId,
            nodeDetail: {},
            loading: false
        }
        this.state = {

        }
    }
    componentDidMount() {
        this.getNodeDetail()
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
        return (
            <div>
                <PageTitle title='Node Detail'></PageTitle>
                <div className="node-detail--info">
                    <div className="info-avatar--wrapper">
                        <img src="" alt="" />
                    </div>
                    <div className="info-summary--wrapper">
                        <p className="info-node">xxxxxxssdasdasd</p>
                        <p className="info-opt">
                            <Button type="primary" shape="round" icon="solution">
                                Delegate
                            </Button>
                            <Button shape="round" icon="export">
                                Unbond
                            </Button>
                        </p>
                    </div>

                </div>
                <div className="node-detail--detail">
                    <div className="detail--user-info">
                        <div className="user-info--delegation">
                            <p className="user-info--title">My Delegation</p>
                            <p className="user-info--value">25,000</p>
                        </div>
                        <div className="user-info--rewards">
                            <p className="user-info--title">My Rewards</p>
                            <p className="user-info--value">10,000</p>
                            <Button className="widthdraw-button" shape="round" icon="dollar">
                                Withdraw Reward
                            </Button>
                        </div>
                    </div>
                    <div className="node-detail--item">
                        <div className="item--title">Node Address</div>
                        <div className="item--value">xxxxxxxxxxxxxxxxxxxxx</div>
                    </div>
                    <div className="node-detail--item">
                        <div className="item--title">Node Description</div>
                        <div className="item--value">xxxxxxxxxxxxxxxxxxxxx</div>
                    </div>
                    <div className="node-detail--item">
                        <div className="item--title">Node Selt-Staked</div>
                        <div className="item--value">xxxxxxxxxxxxxxxxxxxxx</div>
                    </div>
                    <div className="node-detail--item">
                        <div className="item--title">Total Delegated</div>
                        <div className="item--value">xxxxxxxxxxxxxxxxxxxxx</div>
                    </div>
                    <div className="node-detail--item">
                        <div className="item--title">Reward Cut</div>
                        <div className="item--value">xxxxxxxxxxxxxxxxxxxxx</div>
                    </div>
                    <div className="node-detail--item">
                        <div className="item--title">Uptime</div>
                        <div className="item--value">xxxxxxxxxxxxxxxxxxxxx</div>
                    </div>
                </div>
            </div>
        )
    }
}
