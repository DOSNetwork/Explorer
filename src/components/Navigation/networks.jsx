import { injectIntl } from 'react-intl'
import { Button } from 'antd'


function Networks(props) {
    const { formatMessage: f } = props.intl;
    const { connectedNetwork } = props;
    return (
        <div className="connector-list--wrapper">
          <Button type={ connectedNetwork === 'mainnet' ? 'primary' : 'default'} onClick={() => { onSwitch(connectedNetwork, 'mainnet') }}>
            {f({ id: 'Networks.Ethereum'})}
          </Button>
          <Button type={ connectedNetwork === 'bsc' ? 'primary' : 'default'} onClick={() => { onSwitch(connectedNetwork, 'bsc') }}>
            {f({ id: 'Networks.BSC'})}
          </Button>
        </div>
    )
}

async function onSwitch(connectedNetwork, switchToNetwork) {
  // Default to Ethereum mainnet
  let chain_id = 1;
  let rpc_url = 'https://mainnet.infura.io/';
  if (switchToNetwork === 'bsc') {
    chain_id = 56;
    rpc_url = 'https://bsc-dataseed1.defibit.io/';
  }
  chain_id = '0x' + Number(chain_id).toString(16);
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain_id }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            { 
              chainId: chain_id,
              rpcUrl: rpc_url 
            }
          ],
        });
      } catch (addError) {
        // handle "add" error
        console.log('addNetworkError: ', addError);
      }
    }
    return;
  }
  if (connectedNetwork !== switchToNetwork) {
    setTimeout(() => { window.location.reload(true) }, 500)
  }
}

export default injectIntl(Networks)
