import React, { Component } from 'react'
import { SubTitle } from '../../Layout/page'
import { Icon } from 'antd'
export default class Account extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showNumber: true
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
        return this.state.showNumber?value:'***';
    }
    render() {
        const {showNumber} = this.state
        return (
            <>
                <SubTitle title='My Account'></SubTitle>
                <div className="myaccount--wrapper">
                    <div className="myaccount-balance">
                        <DescLabel label='Account Balance' /><Icon style={{ fontSize: 27, marginLeft: 30, cursor: 'pointer' }} type={showNumber?'eye':'eye-invisible'} onClick={this.ToggleNumber} />
                        <p className="account-number big-size">{this.numberToggler('28,999.91')}</p>
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
