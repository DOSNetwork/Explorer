import React, { useContext } from "react";
import { message, Tabs } from "antd";
import { AppContext, NodeDetailContext } from './context'
import DelegateNode from "./delegateNodeForm";
import UnbondNode from "./unbondNodeForm";
import UnbondOwnedNode from "./unbondOwnedNodeForm";
import UpdateStakingNode from "./updateStakingNodeForm"
import { MAX_ALLOWANCE } from "../../util/const";
const { TabPane } = Tabs;
const TabbarRender = tabbarName => {
    return <div className="node-detail--tab-bar">{tabbarName}</div>;
};
function NodeDetailOperations(props) {

    const { userAddress, web3Client, stakingContract, dosTokenContract,
        dbTokenContract,
        constant, f } = useContext(AppContext)
    const { pageInfos, nodeDetail, handleEmmiterEvents } = useContext(NodeDetailContext)
    let updateFormformRef = null,
        unbondFormformRef = null,
        delegateFormRef = null,
        unbondOwnedNodeRef = null
    const {
        node: nodeAddr,
    } = nodeDetail;
    const {
        isUserOwnedThisNode,
        isUserDelegatedThisNode,
        userBalance,
        myTokenTotal
    } = pageInfos

    function saveUpdateFormRef(formRef) {
        updateFormformRef = formRef;
    };
    function saveUnbondFormRef(formRef) {
        unbondFormformRef = formRef;
    };
    function saveDelegateFormRef(formRef) {
        delegateFormRef = formRef;
    };
    function saveUnbondOwnedNodeRef(formRef) {
        unbondOwnedNodeRef = formRef;
    };

    async function handleOwnerUpdateNodeSubmit(e) {
        e.preventDefault();
        console.log(`submit`)
        const { form } = updateFormformRef.props;
        const allowance = await dosTokenContract.methods
            .allowance(userAddress, constant.STAKING_CONTRACT_ADDRESS)
            .call();
        const dbAllowance = await dbTokenContract.methods
            .allowance(userAddress, constant.STAKING_CONTRACT_ADDRESS)
            .call();

        form.validateFields((err, values) => {
            console.log(err, values)
            if (err) {
                return;
            }
            if (!values.tokenAmount && !values.dbAmount && !values.rewardCut && !values.nodeDesc && !values.logoUrl) {
                return;
            }
            let tokenAmount = values.tokenAmount || 0;
            tokenAmount = web3Client.utils.toWei(tokenAmount.toString(), "ether");
            const dbAmount = values.dbAmount ? values.dbAmount : 0;
            let rewardCut = web3Client.utils.toBN(2)
                .pow(web3Client.utils.toBN(256))
                .sub(web3Client.utils.toBN(1))
                .toString();
            if (values.rewardCut !== undefined) {
                rewardCut = values.rewardCut;
            }
            const nodeDesc = values.nodeDesc || ''
            const newLogoUrl = values.logoUrl || "";
            const updateFunc = function (receipt) {
                let emitter = stakingContract.methods
                    .updateNodeStaking(nodeAddr, tokenAmount, dbAmount, rewardCut, nodeDesc, newLogoUrl)
                    .send({ from: userAddress });

                handleEmmiterEvents(
                    emitter,
                    "Update Node",
                    hash => {
                        message.loading(
                            f({ id: "Events.Loading" }, { type: "updateNode", hash: hash }),
                            0
                        );
                    },
                    (confirmationNumber, receipt) => {
                        message.destroy();
                        message.success(
                            f(
                                { id: "Events.Success" },
                                { type: "updateNode", blockNumber: receipt.blockNumber }
                            )
                        );
                        form.resetFields();
                    }
                );
            };
            const dbApproveThenUpdate = function (receipt) {
                console.log("call dbApprove then newNodeFunc");
                try {
                    let emitter = dbTokenContract.methods
                        .approve(constant.STAKING_CONTRACT_ADDRESS)
                        .send({ from: userAddress });
                    handleEmmiterEvents(
                        emitter,
                        "dbApprove",
                        hash => {
                            updateFunc();
                            message.loading(
                                f({ id: "Events.Loading" }, { type: "approve", hash: hash }),
                                0
                            );
                        },
                        (confirmationNumber, receipt) => {
                            message.destroy();
                            message.success(
                                f(
                                    { id: "Events.Success" },
                                    { type: "approve", blockNumber: receipt.blockNumber }
                                )
                            );
                        },
                        error => {
                            message.error(error.message.split("\n")[0]);
                        }
                    );
                } catch (e) {
                    message.error(e.reason);
                }
            };
            const dbApproveFunc = function (receipt) {
                console.log("call dbApprove then newNodeFunc");
                try {
                    let emitter = dbTokenContract.methods
                        .approve(constant.STAKING_CONTRACT_ADDRESS)
                        .send({ from: userAddress });
                    handleEmmiterEvents(
                        emitter,
                        "dbApprove",
                        hash => {
                            message.loading(
                                f({ id: "Events.Loading" }, { type: "approve", hash: hash }),
                                0
                            );
                        },
                        (confirmationNumber, receipt) => {
                            message.destroy();
                            message.success(
                                f(
                                    { id: "Events.Success" },
                                    { type: "approve", blockNumber: receipt.blockNumber }
                                )
                            );
                        },
                        error => {
                            message.error(error.message.split("\n")[0]);
                        }
                    );
                } catch (e) {
                    message.error(e.reason);
                }
            };
            const approveThenUpdate = function (receipt) {
                console.log("call approveFunc then newNodeFunc");
                try {
                    let emitter = dosTokenContract.methods
                        .approve(constant.STAKING_CONTRACT_ADDRESS)
                        .send({ from: userAddress });
                    handleEmmiterEvents(
                        emitter,
                        "Approve",
                        hash => {
                            updateFunc();
                            message.loading(
                                f({ id: "Events.Loading" }, { type: "approve", hash: hash }),
                                0
                            );
                        },
                        (confirmationNumber, receipt) => {
                            message.destroy();
                            message.success(
                                f(
                                    { id: "Events.Success" },
                                    { type: "approve", blockNumber: receipt.blockNumber }
                                )
                            );
                        },
                        error => {
                            message.error(error.message.split("\n")[0]);
                        }
                    );
                } catch (e) {
                    message.error(e.reason);
                }
            };
            if (dbAmount !== 0 && dbAllowance.toString() !== MAX_ALLOWANCE) {
                if (tokenAmount !== 0 && allowance.toString() !== MAX_ALLOWANCE) {
                    dbApproveFunc();
                    approveThenUpdate();
                } else {
                    dbApproveThenUpdate();
                }
            } else {
                if (tokenAmount !== 0 && allowance.toString() !== MAX_ALLOWANCE) {
                    approveThenUpdate();
                } else {
                    updateFunc();
                }
            }
        });
    };
    async function handleUserDelegateSubmit(e) {
        e.preventDefault();
        const { form } = delegateFormRef.props;
        const allowance = await dosTokenContract.methods
            .allowance(userAddress, constant.STAKING_CONTRACT_ADDRESS)
            .call();
        // this.setState({
        //     delegateFormLoading: true
        // });
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let tokenAmount = values.tokenAmount || 0;
            tokenAmount = web3Client.utils.toWei(tokenAmount.toString(), "ether");
            const delegateFunc = function (receipt) {
                try {
                    let emitter = stakingContract.methods
                        .delegate(tokenAmount, nodeAddr)
                        .send({ from: userAddress });

                    handleEmmiterEvents(
                        emitter,
                        "User Delegate",
                        hash => {
                            message.loading(
                                f({ id: "Events.Loading" }, { type: "delegate", hash: hash }),
                                0
                            );
                        },
                        (confirmationNumber, receipt) => {
                            message.destroy();
                            message.success(
                                f(
                                    { id: "Events.Success" },
                                    { type: "delegate", blockNumber: receipt.blockNumber }
                                )
                            );
                            form.resetFields();
                        },
                        error => {
                            message.error(error.message.split("\n")[0]);
                        }
                    );
                } catch (e) {
                    console.log("e3 err ", e);
                    message.error(e.reason);
                }
            };
            if (allowance.toString() !== MAX_ALLOWANCE) {
                try {
                    let emitter = dosTokenContract.methods
                        .approve(constant.STAKING_CONTRACT_ADDRESS)
                        .send({ from: userAddress });
                    handleEmmiterEvents(
                        emitter,
                        "User Approve",
                        hash => {
                            message.loading(
                                f({ id: "Events.Loading" }, { type: "approve", hash: hash }),
                                0
                            );
                        },
                        (confirmationNumber, receipt) => {
                            message.destroy();
                            message.success(
                                f(
                                    { id: "Events.Success" },
                                    { type: "approve", blockNumber: receipt.blockNumber }
                                )
                            );
                            delegateFunc();
                        },
                        error => {
                            message.error(error.message.split("\n")[0]);
                        }
                    );
                } catch (e) {
                    message.error(e.reason);
                }
            } else {
                delegateFunc();
            }
        });
    };
    async function handleOwnerUnbondSubmit(e) {
        e.preventDefault();
        const { form } = unbondOwnedNodeRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let tokenAmount = values.tokenAmount || 0;
            tokenAmount = web3Client.utils.toWei(tokenAmount.toString(), "ether");
            const dbAmount = values.dbAmount;
            let emitter = stakingContract.methods
                .nodeUnbond(tokenAmount, dbAmount, nodeAddr)
                .send({ from: userAddress });
            handleEmmiterEvents(
                emitter,
                "Owner Unbond",
                hash => {
                    message.loading(
                        f({ id: "Events.Loading" }, { type: "unbond", hash: hash }),
                        0
                    );
                },
                (confirmationNumber, receipt) => {
                    message.destroy();
                    message.success(
                        f(
                            { id: "Events.Success" },
                            { type: "unbond", blockNumber: receipt.blockNumber }
                        )
                    );
                    form.resetFields();
                }
            );

            // setState({
            //     unbondOwnedNodeLoading: false,
            //     unbondOwnedNodeVisible: false
            // });
        });
    };
    async function handleUserUnbondSubmit(e) {
        e.preventDefault();
        const { form } = unbondFormformRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let tokenAmount = values.tokenAmount || 0;
            tokenAmount = web3Client.utils.toWei(tokenAmount.toString(), "ether");
            let emitter = stakingContract.methods
                .delegatorUnbond(tokenAmount, nodeAddr)
                .send({ from: userAddress });

            handleEmmiterEvents(
                emitter,
                "Delegator Unbond",
                hash => {
                    message.loading(
                        f({ id: "Events.Loading" }, { type: "unbond", hash: hash }),
                        0
                    );
                },
                (confirmationNumber, receipt) => {
                    message.destroy();
                    message.success(
                        f(
                            { id: "Events.Success" },
                            { type: "unbond", blockNumber: receipt.blockNumber }
                        )
                    );
                    form.resetFields();
                }
            );
            // this.setState({
            //     formText: "",
            //     unbondFormLoading: false,
            //     unbondFormVisible: false
            // });
        });
    };

    return (
        <div className="node-detail--operations node-detail--block">
            <Tabs
                className="node-detail--operation-tab"
                defaultActiveKey="1"
                size="default"
            >
                <TabPane
                    tab={TabbarRender(
                        isUserDelegatedThisNode
                            ? f({ id: "Tooltip.NodeDetail.Delegate" })
                            : f({ id: "Tooltip.NodeDetail.UpdateNode" })
                    )}
                    key="1"
                >
                    <div className="tab-pannel--wrapper">
                        {isUserOwnedThisNode ? (
                            // Owner --Staking
                            <UpdateStakingNode
                                wrappedComponentRef={saveUpdateFormRef}
                                onSubmit={handleOwnerUpdateNodeSubmit}
                                maxBalance={userBalance}
                            />
                        ) : (
                                // User --Delegate
                                <DelegateNode
                                    wrappedComponentRef={saveDelegateFormRef}
                                    onSubmit={handleUserDelegateSubmit}
                                    maxBalance={userBalance}
                                />
                            )}
                    </div>
                </TabPane>
                <TabPane
                    tab={TabbarRender(f({ id: "Tooltip.NodeDetail.Unbond" }))}
                    key="2"
                >
                    <div className="tab-pannel--wrapper">
                        {isUserOwnedThisNode ? (
                            // Owner --unbond
                            <UnbondOwnedNode
                                wrappedComponentRef={saveUnbondOwnedNodeRef}
                                onSubmit={handleOwnerUnbondSubmit}
                                maxBalance={myTokenTotal}
                            />
                        ) : (
                                // User --unbond
                                <UnbondNode
                                    wrappedComponentRef={saveUnbondFormRef}
                                    onSubmit={handleUserUnbondSubmit}
                                    maxBalance={myTokenTotal}
                                />
                            )}
                    </div>
                </TabPane>
            </Tabs>
        </div>
    )
}


export default NodeDetailOperations
