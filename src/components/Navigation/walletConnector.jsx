import React, { useState, useCallback } from "react";
import { connect } from 'react-redux'
import { injectIntl } from "react-intl";
import { Modal } from 'antd';
import Connectors from './connectors'
import {
    WalletIcon
} from '../SvgIcon/icons.jsx'
function WalletConnector(props) {
    console.log('WalletConnector render')
    let { formatMessage: f } = props.intl;

    const [isConnectorShow, setIsConnectorShow] = useState(false)
    console.log(isConnectorShow)
    const closeModal = useCallback(
        () => {
            console.log('close')
            setIsConnectorShow(false)
        },
        [],
    )
    let { userAddress = '', isWalletLogin, web3Context } = props.contract;
    return (
        <>
            {
                isWalletLogin ?
                    <div className="wallet__status__panel" onClick={() => { setIsConnectorShow(true) }}>
                        < WalletIcon />
                        <div className='wallet__login-logged'>
                            <p >{`${userAddress.slice(0, 6)}...${userAddress.slice(-6)}`}</p>
                        </div>
                    </div >
                    :
                    <div className="wallet__status__panel" onClick={() => { setIsConnectorShow(true) }}>
                        < WalletIcon />
                        <p className="wallet__login-button" >{f({ id: 'Wallet.connectwallet' })}</p>
                    </div >
            }
            <Modal
                closable={false}
                visible={isConnectorShow}
                title={'Connect Wallet'}
                onCancel={closeModal}
                footer={null}
                width={600}
            >
                <Connectors web3Context={web3Context} closeModal={closeModal} />
            </Modal>
        </>
    )
}



const mapStateToProps = (state) => ({
    contract: state.contract,
    global: state.global
})
const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(WalletConnector))
