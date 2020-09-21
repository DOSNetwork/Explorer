import React, { useContext } from "react";
import numeral from "numeral";
import { AppContext, NodeDetailContext } from './context'
import { EllipsisString } from "../../util/util";
import { Button, message, Modal } from "antd";
import { ReloadOutlined } from '@ant-design/icons';
const { confirm } = Modal;
const numberFormatRender = (text, record, index) => {
    return numeral(text).format("0,0.00");
};

function NodeDetailInfos() {
    const { f, stakingContract, userAddress } = useContext(AppContext)
    const { isWalletLogin, nodeDetail, handleEmmiterEvents, pageInfos, counting } = useContext(NodeDetailContext)
    const {
        node: nodeAddr,
        avatar,
        description,
        selfStakedAmount,
        totalOtherDelegatedAmount,
        rewardCut,
        nodeUptime,
        status
    } = nodeDetail;
    const {
        secondsCounting,
        realTimeRewardsPulling
    } = counting
    const {
        isUserOwnedThisNode,
        isUserDelegatedThisNode,
        myTokenTotal,
        myRewardTotal,
        withDrawalTotal,
        dropBurnToken,
        withDrawalFrozen,
        withDrawalDropBurn,
        withDrawalDropBurnFrozen
    } = pageInfos
    function handleOwnerWithdraw() {
        let emitterName = "Owner Withdraw";
        if (+withDrawalTotal === 0) {
            Modal.warning({
                title: emitterName,
                content: f({ id: "Form.Message.OwnerWithdraw" })
            });
            return;
        }
        let emitter = stakingContract.methods
            .nodeWithdraw(nodeAddr)
            .send({ from: userAddress });

        handleEmmiterEvents(
            emitter,
            emitterName,
            hash => {
                message.loading(
                    f({ id: "Events.Loading" }, { type: "withdraw", hash: hash }),
                    0
                );
            },
            (confirmationNumber, receipt) => {
                message.destroy();
                message.success(
                    f(
                        { id: "Events.Success" },
                        { type: "withdraw", blockNumber: receipt.blockNumber }
                    )
                );
            }
        );
    }
    function handleOwnerClaimReward() {
        let emitterName = "Owner ClaimReward";
        if (+myRewardTotal === 0) {
            Modal.warning({
                title: emitterName,
                content: f({ id: "Form.Message.OwnerClaimReward" })
            });
            return;
        }
        let emitter = stakingContract.methods
            .nodeClaimReward(nodeAddr)
            .send({ from: userAddress });

        handleEmmiterEvents(
            emitter,
            emitterName,
            hash => {
                message.loading(
                    f({ id: "Events.Loading" }, { type: "claimreward", hash: hash }),
                    0
                );
            },
            (confirmationNumber, receipt) => {
                message.destroy();
                message.success(
                    f(
                        { id: "Events.Success" },
                        { type: "claimreward", blockNumber: receipt.blockNumber }
                    )
                );
            }
        );
    }
    function handleDelegatorWithdraw() {
        let emitterName = "Delegator Withdraw";
        if (+withDrawalTotal === 0) {
            Modal.warning({
                title: emitterName,
                content: f({ id: "Form.Message.DelegatorWithdraw" })
            });
            return;
        }
        let emitter = stakingContract.methods
            .delegatorWithdraw(nodeAddr)
            .send({ from: userAddress });

        handleEmmiterEvents(
            emitter,
            emitterName,
            hash => {
                message.loading(
                    f({ id: "Events.Loading" }, { type: "withdraw", hash: hash }),
                    0
                );
            },
            (confirmationNumber, receipt) => {
                message.destroy();
                message.success(
                    f(
                        { id: "Events.Success" },
                        { type: "withdraw", blockNumber: receipt.blockNumber }
                    )
                );
            }
        );
    }
    function handleDelegatorClaimReward() {
        let emitterName = "Delegator ClaimReward";
        if (+myRewardTotal === 0) {
            Modal.warning({
                title: emitterName,
                content: f({ id: "Form.Message.DelegatorClaimReward" })
            });
            return;
        }
        let emitter = stakingContract.methods
            .delegatorClaimReward(nodeAddr)
            .send({ from: userAddress });

        handleEmmiterEvents(
            emitter,
            emitterName,
            hash => {
                message.loading(
                    f({ id: "Events.Loading" }, { type: "claimreward", hash: hash }),
                    0
                );
            },
            (confirmationNumber, receipt) => {
                message.destroy();
                message.success(
                    f(
                        { id: "Events.Success" },
                        { type: "claimreward", blockNumber: receipt.blockNumber }
                    )
                );
            }
        );
    }
    function handleUnregister() {
        confirm({
            title: f({ id: 'Modal.NodeUnregister.Title' }),
            content: f({ id: 'Modal.NodeUnregister.Content' }),
            okText: "Sure",
            okType: "danger",
            cancelText: "No",
            onOk: () => {
                let emitter = stakingContract.methods
                    .nodeUnregister(nodeAddr)
                    .send({ from: userAddress });

                handleEmmiterEvents(
                    emitter,
                    "User UnRegister",
                    hash => {
                        message.loading(
                            f({ id: "Events.Loading" }, { type: "unregister", hash: hash }),
                            0
                        );
                    },
                    (confirmationNumber, receipt) => {
                        message.destroy();
                        message.success(
                            f(
                                { id: "Events.Success" },
                                { type: "unregister", blockNumber: receipt.blockNumber }
                            )
                        );
                    }
                );
            },
            onCancel() { }
        });
    }
    return (
        <div className="node-detail--infos">
            <div className="node-detail--info node-detail--block">
                <div className="info-avatar--wrapper">
                    <img src={avatar} alt="" />
                </div>
                <div className="info-summary--wrapper">
                    <div className="info-node">
                        <span className="node-address">
                            {EllipsisString(nodeAddr, 6, 6)}
                        </span>
                        {status ? (
                            <div className="node-status__tag tag--active">
                                {f({ id: "Node.active" })}
                            </div>
                        ) : (
                                <div className="node-status__tag tag--inactive">
                                    {f({ id: "Node.inactive" })}
                                </div>
                            )}
                    </div>
                    {isWalletLogin && isUserOwnedThisNode ? (
                        <Button
                            className="unregister-button"
                            //                  icon={<PoweroffOutlined />}
                            shape="round"
                            size="small"
                            onClick={handleUnregister}
                        >
                            {f({ id: 'Node.Unregister' })}
                        </Button>
                    ) : null}
                </div>
            </div>
            <div className="node-detail--detail node-detail--block">
                {isWalletLogin ? (
                    <div className="detail--user-info">
                        <div className="user-info--delegation">
                            <p className="user-info--title">
                                {isUserDelegatedThisNode
                                    ? f({ id: "Tooltip.NodeDetail.MyDelegation" })
                                    : f({ id: "Tooltip.NodeDetail.MyStaking" })}
                            </p>
                            <p className="user-info--value">
                                {numberFormatRender(myTokenTotal)}
                            </p>
                            {+dropBurnToken >= "0" && isUserOwnedThisNode ? (
                                <>
                                    <p className="user-info--title">
                                        {f({ id: "Tooltip.NodeDetail.DropBurnToken" })}
                                    </p>
                                    <p className="user-info--value">
                                        {numberFormatRender(dropBurnToken)}
                                    </p>
                                </>
                            ) : null}
                        </div>
                        <div className="user-info--rewards">
                            <p className="user-info--title">
                                {f({ id: "Tooltip.NodeDetail.WithdrawalFrozen" })}
                            </p>
                            <p className="user-info--value">
                                {numberFormatRender(withDrawalTotal)}
                                <span className="value--frozen">
                                    / {numberFormatRender(withDrawalFrozen)}
                                </span>
                            </p>
                            {(+withDrawalDropBurn >= "0" ||
                                +withDrawalDropBurnFrozen >= "0") &&
                                isUserOwnedThisNode ? (
                                    <>
                                        <p className="user-info--title">
                                            {f({
                                                id: "Tooltip.NodeDetail.WithdrawalDropBurnFrozen"
                                            })}
                                        </p>
                                        <p className="user-info--value">
                                            {numberFormatRender(withDrawalDropBurn)}
                                            <span className="value--frozen">
                                                / {numberFormatRender(withDrawalDropBurnFrozen)}
                                            </span>
                                        </p>
                                    </>
                                ) : null}
                            {isUserDelegatedThisNode ? (
                                <Button
                                    className="widthdraw-button"
                                    shape="round"
                                    size="small"
                                    onClick={handleDelegatorWithdraw}
                                >
                                    {f({ id: "Tooltip.NodeDetail.Withdraw" })}
                                </Button>
                            ) : (
                                    <Button
                                        className="widthdraw-button"
                                        shape="round"
                                        size="small"
                                        onClick={handleOwnerWithdraw}
                                    >
                                        {f({ id: "Tooltip.NodeDetail.Withdraw" })}
                                    </Button>
                                )}
                        </div>
                        <div className="user-info--rewards">
                            <p className="user-info--title">
                                {f({ id: "Tooltip.NodeDetail.MyRewards" })}
                            </p>
                            <p className="user-info--value">
                                {numberFormatRender(myRewardTotal)}
                                {(myTokenTotal > 0) ? (<><span className="secord-counting">{secondsCounting}s</span><ReloadOutlined spin={realTimeRewardsPulling} style={{ fontSize: '14px' }} /></>) : <></>}
                            </p>
                            {isUserDelegatedThisNode ? (
                                <Button
                                    className="widthdraw-button"
                                    shape="round"
                                    size="small"
                                    onClick={handleDelegatorClaimReward}
                                >
                                    {f({ id: "Tooltip.NodeDetail.Claim" })}
                                </Button>
                            ) : (
                                    <Button
                                        className="widthdraw-button"
                                        shape="round"
                                        size="small"
                                        onClick={handleOwnerClaimReward}
                                    >
                                        {f({ id: "Tooltip.NodeDetail.Claim" })}
                                    </Button>
                                )}
                        </div>
                    </div>
                ) : null}
                <div className="node-detail--item">
                    <div className="item--title">
                        {f({ id: "Tooltip.NodeDetail.NodeAddress" })}
                    </div>
                    <div className="item--value">{nodeAddr}</div>
                </div>
                <div className="node-detail--item">
                    <div className="item--title">
                        {f({ id: "Tooltip.NodeDetail.NodeDescription" })}
                    </div>
                    <div className="item--value">{description}</div>
                </div>
                <div className="node-detail--item">
                    <div className="item--title">
                        {f({ id: "Tooltip.NodeDetail.NodeSelt-Staked" })}
                    </div>
                    <div className="item--value">
                        {numberFormatRender(selfStakedAmount)}
                    </div>
                </div>
                <div className="node-detail--item">
                    <div className="item--title">
                        {f({ id: "Tooltip.NodeDetail.TotalDelegated" })}
                    </div>
                    <div className="item--value">
                        {numberFormatRender(totalOtherDelegatedAmount)}
                    </div>
                </div>
                <div className="node-detail--item">
                    <div className="item--title">
                        {f({ id: "Tooltip.NodeDetail.RewardCut" })}
                    </div>
                    <div className="item--value">{rewardCut}%</div>
                </div>
                <div className="node-detail--item">
                    <div className="item--title">
                        {f({ id: "Tooltip.NodeDetail.Uptime" })}
                    </div>
                    <div className="item--value">
                        {nodeUptime} {f({ id: "Tooltip.NodeDetail.Days" })}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NodeDetailInfos
