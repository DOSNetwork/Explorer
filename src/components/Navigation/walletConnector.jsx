import React, { useState, useCallback } from "react";
import { connect } from 'react-redux'
import { injectIntl } from "react-intl";
import { Modal } from 'antd';
import Connectors from './connectors'

function WalletConnector(props) {
    console.log('WalletConnector render')
    let { formatMessage: f } = props.intl;

    const [isConnectorShow, setIsConnectorShow] = useState(false)
    const closeModal = useCallback(
        () => {
            setIsConnectorShow(false)
        },
        [],
    )
    let { userAddress = '', isWalletLogin, web3Context } = props.contract;
    return (
        <>
            {
                isWalletLogin ?
                    <div>
                        <p onClick={() => { setIsConnectorShow(true) }}>{`${userAddress.slice(0, 6)}...${userAddress.slice(-6)}`}</p>
                    </div>
                    :
                    <p className="wallet__login-button" onClick={() => { setIsConnectorShow(true) }}>{f({ id: 'Wallet.connectwallet' })}</p>
            }
            <Modal
                closable={false}
                visible={isConnectorShow}
                title={'Connect Wallet'}
                onCancel={closeModal}
                footer={null}
                width={600}
            >
                <Connectors web3Context={web3Context} />
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
