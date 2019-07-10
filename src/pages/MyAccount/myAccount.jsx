import React, { Component } from 'react'
import { SubTitle } from '../../Layout/page'
import { Icon, Spin } from 'antd'

import web3 from '../../util/web3.js'
import { DOS_ABI, DOS_CONTRACT_ADDRESS } from '../../util/const'
export default class Account extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showNumber: true,
            userContract: null,
            netWork: ''
        }
    }
    ToggleNumber = () => {
        this.setState(function (state) {
            return {
                showNumber: !state.showNumber
            }
        })
    }
    numberToggler = (value) => {
        return this.state.showNumber ? (value ? value : <Spin />) : '***';
    }
    componentDidMount() {
        this.initContract()
    }
    loadUserBalance = () => {
        this.props.globalLoading(true)
        web3.eth.getAccounts().then((userAddress) => {
            if (userAddress && userAddress.length > 0) {
                this.state.userContract.methods.balanceOf(userAddress[0]).call().then((balance) => {
                    let showBalance = web3.utils.fromWei(balance.toString('10'))
                    this.setState({
                        userBalance: showBalance
                    })
                })
            }
        })
    }
    initContract = async () => {
        let contractInstance = new web3.eth.Contract(DOS_ABI, DOS_CONTRACT_ADDRESS);
        let network = await web3.eth.net.getId()
        let result
        switch (network) {
            case 1:
                result = "mainnet";
                break
            case 2:
                result = "morden";
                break
            case 3:
                result = "ropsten";
                break
            case 4:
                result = "rinkeby";
                break
            default:
                result = "unknown network = " + network;
        }
        this.setState({ userContract: contractInstance, netWork: result })
        this.loadUserBalance()
    }
    render() {
        const { showNumber, userBalance } = this.state
        return (
            <>
                <SubTitle title='My Account'></SubTitle>
                <div className="myaccount--wrapper">
                    <div className="myaccount-balance">
                        <DescLabel label='Account Balance' /><Icon style={{ fontSize: 27, marginLeft: 30, cursor: 'pointer' }} type={showNumber ? 'eye' : 'eye-invisible'} onClick={this.ToggleNumber} />
                        <div className="account-number big-size">{this.numberToggler(userBalance)}</div>
                    </div>
                    <div className="myaccount-detail--wrapper">
                        <div className="detail--container">
                            <DescLabel label='Total Delegated' />
                            <p className="account-number">{this.numberToggler('8,999.91')}</p>
                        </div>
                        <div className="detail--container">
                            <DescLabel label='My Rewards' />
                            <p className="account-number">{this.numberToggler('18,999.91')}</p>
                        </div>
                        <div className="detail--container">
                            <DescLabel label='Unbonded tokens' />
                            <p className="account-number">{this.numberToggler('999')}</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const DescLabel = ({ label, market = 'DOS' }) => {
    return (
        <span className="desc-label">{label}<span className="desc-market">/{market}</span>
        </span>
    )
}
