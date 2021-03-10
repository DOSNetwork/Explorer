import React, { useEffect, useState, useCallback, useContext, useRef } from "react";
import { message } from "antd";
import identicon from "identicon.js";
import "./style.scss";
import { injectIntl } from "react-intl";
import { AppContext, NodeDetailContext } from './context'
import { EmitterHandlerWrapper } from "../../util/contract-helper";
import NodeDetailInfos from './nodeDetailInfos'
import NodeDetailOperations from './nodeDetailOperations'
const useCurrentValue = (val) => {
  const ref = useRef(val);
  useEffect(() => {
    ref.current = val;
  }, [val]);
  return ref
}
function NodeDetail(props) {
  const { web3Client, stakingContract, dosTokenContract, userAddress, isWalletLogin, nodeId, f } = useContext(AppContext)
  const [nodeAddr] = useState(nodeId)
  const [nodeDetail, setNodeDetail] = useState({ node: '' })
  const [, setLoading] = useState(false)
  const [pageInfos, setPageInfos] = useState({
    isUserOwnedThisNode: false,
    isUserDelegatedThisNode: false,
    myTokenTotal: 0,
    myRewardTotal: 0,
    withDrawalTotal: 0,
    dropBurnToken: 0,
    withDrawalFrozen: 0,
    withDrawalDropBurn: 0,
    withDrawalDropBurnFrozen: 0
  })
  const [counting, setCounting] = useState({
    secondsCounting: 14,
    realTimeRewardsPulling: false
  })
  const countRef = useCurrentValue(counting)
  const pageInfoRef = useCurrentValue(pageInfos)
  const [unMountRemoveListenerCallbacks] = useState([])
  const unMount = useCallback(
    () => {
      unMountRemoveListenerCallbacks.forEach(fn => {
        typeof fn === "function" && fn.call(null);
      });
    }, [unMountRemoveListenerCallbacks]
  )
  useEffect(() => {
    getNodeDetail();
    return () => {
      unMount()
    }
  }, [])

  function fromWei(bn) {
    if (!bn || bn === "-") {
      return "";
    }
    return web3Client.utils.fromWei(bn.toString("10"));
  }

  function handleEmmiterEvents(
    emitter,
    emitterName,
    hashCallback,
    successCallback
  ) {
    // let pageInstance = this;
    unMountRemoveListenerCallbacks.push(
      EmitterHandlerWrapper(
        emitter,
        hash => {
          hashCallback.call(this, hash);
        },
        (confirmationNumber, receipt) => {
          successCallback.call(this, confirmationNumber, receipt);
          if (!this.unMount) {
            getNodeDetail();
          }
        },
        error => {
          message.error(error.message.split("\n")[0]);
        },
        { emmiterName: emitterName }
      )
    );
  };
  async function startCounting() {
    setCounting({
      secondsCounting: 14,
      realTimeRewardsPulling: false
    })
    const countingInterval = setInterval(async () => {
      let { secondsCounting,
        realTimeRewardsPulling } = countRef.current
      let pulling = realTimeRewardsPulling
      if (secondsCounting > 0) {
        if (secondsCounting === 1) {
          pulling = true
        }
        let newCounting = {
          secondsCounting: secondsCounting - 1 >= 0 ? secondsCounting - 1 : 0,
          realTimeRewardsPulling: pulling
        }
        // countRef.current = newCounting
        setCounting(newCounting)
      } else {
        await getRewards()
      }
      return;
    }, 1060)
    return () => {
      clearInterval(countingInterval);
    }
  };
  async function getRewards() {
    let myRewardTotal = 0;
    let { isUserOwnedThisNode } = pageInfoRef.current
    try {
      if (userAddress) {
        if (isUserOwnedThisNode) {
          let rewardTotal = await stakingContract.methods
            .getNodeRewardTokensRT(nodeAddr)
            .call();
          myRewardTotal = fromWei(rewardTotal);
        } else {
          let userDelegatedRewardTotal = await stakingContract.methods
            .getDelegatorRewardTokensRT(userAddress, nodeAddr)
            .call();
          myRewardTotal = fromWei(userDelegatedRewardTotal);
        }
      }
    } catch (e) {
      message.error('get rewards error')
    }
    setPageInfos({
      ...pageInfoRef.current,
      myRewardTotal: myRewardTotal
    })
    setCounting({
      secondsCounting: 14,
      realTimeRewardsPulling: false
    })
  };
  async function getNodeDetail() {
    setLoading(true)
    const nodeDetailObj = await stakingContract.methods.nodes(nodeAddr).call();
    const {
      selfStakedAmount,
      totalOtherDelegatedAmount,
      pendingWithdrawToken,
      pendingWithdrawDB,
      rewardCut,
      description,
      stakedDB,
      running,
      ownerAddr,
      logoUrl
    } = nodeDetailObj;
    let uptime = await stakingContract.methods.getNodeUptime(nodeAddr).call();
    let avatar = logoUrl || `data:image/png;base64,${new identicon(
      nodeAddr,
      100
    ).toString()}`;

    const nodeDetail = {
      node: nodeAddr,
      avatar: avatar,
      nodeAddr: nodeAddr,
      description: description,
      selfStakedAmount: fromWei(selfStakedAmount),
      totalOtherDelegatedAmount: fromWei(totalOtherDelegatedAmount),
      rewardCut: rewardCut.toString(),
      nodeUptime: Math.round(+uptime / (60 * 60 * 24)),
      status: running
    };
    if (userAddress === "") {
      setNodeDetail(nodeDetail)
    }

    let rewardotal = 0,
      myTokenTotal = 0,
      withDrawalTotal = 0,
      withDrawalFrozen = 0,
      myRewardTotal = 0,
      userDelegatedRewardTotal = 0,
      withDrawalDropBurn = 0,
      withDrawalDropBurnFrozen = 0,
      isUserDelegatedThisNode = false,
      isUserOwnedThisNode = false,
      userBalance = 0;
    if (userAddress) {
      isUserOwnedThisNode =
        web3Client.utils.toChecksumAddress(userAddress) ===
        web3Client.utils.toChecksumAddress(ownerAddr);
      if (isUserOwnedThisNode) {
        const nodeWithdrawableTotal = await stakingContract.methods
          .nodeWithdrawable(ownerAddr, nodeAddr)
          .call();
        rewardotal = await stakingContract.methods
          .getNodeRewardTokensRT(nodeAddr)
          .call();
        myTokenTotal = fromWei(selfStakedAmount);
        withDrawalTotal =
          Math.round(fromWei(nodeWithdrawableTotal[0]) * 100) / 100;
        let tempBn = new web3Client.utils.toBN(pendingWithdrawToken);
        tempBn = tempBn.sub(
          new web3Client.utils.toBN(nodeWithdrawableTotal[0])
        );
        withDrawalFrozen = Math.round(fromWei(tempBn.toString()) * 100) / 100;
        withDrawalDropBurn = nodeWithdrawableTotal[1];
        withDrawalDropBurnFrozen = pendingWithdrawDB - withDrawalDropBurn;

        myRewardTotal = fromWei(rewardotal);
      } else {
        const delegatorWithdrawableTotal = await stakingContract.methods
          .delegatorWithdrawable(userAddress, nodeAddr)
          .call();
        let delegator = await stakingContract.methods
          .delegators(userAddress, nodeAddr)
          .call();
        userDelegatedRewardTotal = await stakingContract.methods
          .getDelegatorRewardTokensRT(userAddress, nodeAddr)
          .call();

        let { delegatedAmount, pendingWithdraw } = delegator;
        let tempBn = new web3Client.utils.toBN(pendingWithdraw);
        tempBn = tempBn.sub(
          new web3Client.utils.toBN(delegatorWithdrawableTotal)
        );
        withDrawalFrozen = Math.round(fromWei(tempBn.toString()) * 100) / 100;
        withDrawalTotal =
          Math.round(fromWei(delegatorWithdrawableTotal) * 100) / 100;
        myTokenTotal = fromWei(delegatedAmount);
        myRewardTotal = fromWei(userDelegatedRewardTotal);
        isUserDelegatedThisNode =
          fromWei(delegatedAmount) !== 0 ||
          fromWei(pendingWithdraw) !== 0 ||
          fromWei(userDelegatedRewardTotal) !== 0;
      }

      userBalance = await dosTokenContract.methods
        .balanceOf(userAddress)
        .call();
      userBalance = fromWei(userBalance)
      console.log(`bal ${userBalance}`);
    }
    setPageInfos({
      isUserOwnedThisNode: isUserOwnedThisNode,
      isUserDelegatedThisNode: isUserDelegatedThisNode,
      myTokenTotal: myTokenTotal,
      myRewardTotal: myRewardTotal,
      withDrawalTotal: withDrawalTotal,
      dropBurnToken: stakedDB,
      withDrawalFrozen: withDrawalFrozen,
      withDrawalDropBurn: withDrawalDropBurn,
      withDrawalDropBurnFrozen: withDrawalDropBurnFrozen,
      userBalance: userBalance
    })
    setNodeDetail(nodeDetail)
    if (myTokenTotal > 0) {
      unMountRemoveListenerCallbacks.push(await startCounting())
    }
  };

  return (
    <NodeDetailContext.Provider
      value={{ isWalletLogin, nodeDetail, pageInfos, counting, handleEmmiterEvents }}>
      <div className="node-detail--wrapper">
        <NodeDetailInfos></NodeDetailInfos>
        {isWalletLogin ? (
          <NodeDetailOperations></NodeDetailOperations>
        ) : null}
      </div>
    </NodeDetailContext.Provider>
  );
}

function NodeDetailPage(props) {
  let { formatMessage: f } = props.intl;
  const { web3Client, stakingContract, userAddress, isWalletLogin, dosTokenContract,
    dbTokenContract,
    constant } = props.contract;
  const nodeId = props.match.params.nodeId
  return (
    <AppContext.Provider
      value={{
        userAddress,
        web3Client,
        stakingContract,
        dosTokenContract,
        dbTokenContract,
        isWalletLogin,
        nodeId,
        constant,
        f
      }}>
      <NodeDetail />
    </AppContext.Provider>
  )
}
export default injectIntl(NodeDetailPage);
