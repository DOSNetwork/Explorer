import React, { useEffect, useState, useCallback } from "react";
import {
    useWeb3React
} from "@web3-react/core";
import { injectIntl } from 'react-intl'
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { connectorsMapping } from '../../util/connector'
import { dispatchWalletActivated, dispatchWalletDeactivated } from '../../util/web3'
function Connectors(props) {
    const { web3Context, closeModal } = props
    const currentConnectedConnector = (web3Context && web3Context.connector) || null
    console.log('Connectors render')
    const context = useWeb3React()
    const {
        connector,
        library,
        account,
        activate,
        deactivate,
        active,
    } = context;
    const [currentConnectingConnector, setCurrentConnectingConnector] = useState()
    const deactivateCallback = useCallback(
        () => {
            deactivate()
            closeModal()
        },
        [deactivate, closeModal],
    )
    const activateCallback = useCallback(
        (connector) => {
            activate(connector)
            closeModal()
        },
        [activate, closeModal],
    )
    useEffect(() => {
        if (currentConnectingConnector && currentConnectingConnector === connector) {
            console.log(`useEffect:setCurrentConnectingConnector`)
            setCurrentConnectingConnector(undefined);
        }
    }, [currentConnectingConnector, connector]);

    useEffect(() => {
        if (account && active && library) {
            console.log('dispatchWalletActivated: ', context);
            dispatchWalletActivated(account, context)
        }
    }, [account, active, context, library]);
    return (
        <div className="connector-list--wrapper">
            {Object.keys(connectorsMapping).map(connectorName => {
                const currentConnector = connectorsMapping[connectorName];
                const connecting = currentConnector === currentConnectingConnector;
                const connected = (currentConnector === connector || currentConnector === currentConnectedConnector);
                // const disabled = !!currentConnectingConnector || !!error;
                const showIcon = !connecting && !connected;
                const showLoading = connecting;
                const showConnected = !connecting && connected;
                let url;
                let displayName = connectorName;
                if (connectorName === 'MetaMask') {
                    url = require('./assets/wallet-icons/metamask.svg')
                } else if (connectorName === 'TrustWallet') {
                    url = require('./assets/wallet-icons/trustwallet.png')
                } else if (connectorName === 'Ledger') {
                    url = require('./assets/wallet-icons/ledger.svg')
                } else if (connectorName === 'Trezor') {
                    url = require('./assets/wallet-icons/trezor.png')
                } else if (connectorName === 'Default') {
                    return ''
                }
                if (typeof url === "object" && url.default !== null) {
                  url = url.default
                }
                return (
                    <div className='connector-item' key={connectorName} onClick={() => {
                        onConnectorActivate(activateCallback, currentConnector, setCurrentConnectingConnector)
                    }}>
                        <span className='connector-item--name'>{displayName}</span>
                        {showLoading && <Spin indicator={(<LoadingOutlined style={{ fontSize: 24 }} spin />)} />
                        }
                        {showIcon && <img className='connector-item--icon' src={url} alt={displayName} />}
                        {showConnected && <div style={{ background: '#4caf50', borderRadius: '10px', width: '10px', height: '10px', marginRight: '10px' }}></div>}
                    </div>
                )
            })}
            <div className='connector-item item-deactivate' onClick={() => { onConnectDeactivate(deactivateCallback, currentConnectedConnector, setCurrentConnectingConnector) }}>Deactivate</div>
        </div>
    )
}
function onConnectorActivate(activate, connector, setCurrentConnectingConnector) {
    if (connector && typeof activate === 'function') {
        setCurrentConnectingConnector(connector)
        activate(connector)
    }
}


function onConnectDeactivate(deactivate, connector, setCurrentConnectingConnector) {
    if (deactivate) {
        deactivate()
    }
    if (connector && connector.close) {
        connector.close()
    }
    setCurrentConnectingConnector(null)
    dispatchWalletDeactivated()
}

export default injectIntl(Connectors)
