import React, { useState, useCallback } from "react";
import { connect } from 'react-redux'
import { injectIntl } from "react-intl";
import { Button, Modal } from 'antd';
import Networks from './networks';

function NetworkSwitch(props) {
    let { formatMessage: f } = props.intl;
    const [isNetworkSwitchShow, setIsNetworkSwitchShow] = useState(false)
    const closeModal = useCallback(
        () => {
            setIsNetworkSwitchShow(false)
        },
        [],
    )
    let { userAddress = '', isWalletLogin, connectedNetwork, networkSupported } = props.contract;
    return (
      <>
            {
              networkSupported ? 
                (
                  isWalletLogin &&
                    <Button type="primary" shape="round" onClick={() => { setIsNetworkSwitchShow(true) }}>
                      {f({ id: 'Title.switchNetwork'})}
                    </Button>
                ) : 
                (
                  <Button danger="true" shape="round" onClick={() => { setIsNetworkSwitchShow(true) }}>
                    Wrong Network
                  </Button>
                )
            }
            <Modal
                visible={isNetworkSwitchShow}
                title={f({ id: 'Title.switchNetwork'})}
                onCancel={closeModal}
                footer={null}
                width={360}
            >
                <Networks connectedNetwork={connectedNetwork} />
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(NetworkSwitch))
