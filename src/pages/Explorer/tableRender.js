import React from 'react';
import { Icon } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Message from '../../util/message'
export const TxHashRender = (text) => {
    return <span className="txhash--wrapper">
        <span className="txhash--text text--ellipsis">
            {text}
        </span>
        <CopyToClipboard text={text} onCopy={() => {
            Message.Notification.Normal({ key: 'COPY_MESSAGE', message: 'copy success!' })
        }}>
            <Icon style={{ fontSize: 15, color: '#455ec7' }} type="copy" />
        </CopyToClipboard>
    </span>
}
export const MoreInfoRender = (text, record) => {
    switch (record.eventLog) {
        case 'LogUrl':
            return LogUrlRender(record)
        case 'LogRequestUserRandom':
            return LogRequestUserRandomRender(record)
        case 'LogNonSupportedType':
            return LogNonSupportedTypeRender(record)
        case 'LogNonContractCall':
            return LogNonContractCallRender(record)
	    case 'LogCallbackTriggeredFor':
            return LogCallbackTriggeredForRender(record)
        case 'LogUpdateRandom':
            return LogUpdateRandomRender(record)
        case 'LogValidationResult':
            return LogValidationResultRender(record)	
        case 'LogInsufficientPendingNode':
            return LogInsufficientPendingNodeRender(record)
        case 'LogInsufficientWorkingGroup':
            return LogInsufficientWorkingGroupRender(record)
        case 'LogGrouping':
            return LogGroupingRender(record)
        case 'LogPublicKeyAccepted':
            return LogPublicKeyAcceptedRender(record)			
        case 'LogPublicKeySuggested':
            return LogPublicKeySuggestedRender(record)
        case 'LogGroupDissolve':
            return LogGroupDissolveRender(record)	
        case 'LogRegisteredNewPendingNode':
            return LogRegisteredNewPendingNodeRender(record)										
        case 'LogGroupingInitiated':
            return LogGroupingInitiatedRender(record)
        case 'LogNoPendingGroup':
            return LogNoPendingGroupRender(record)
        case 'LogPendingGroupRemoved':
            return LogPendingGroupRemovedRender(record)
        case 'LogError':
            return LogErrorRender(record)
        case 'UpdateGroupToPick':
            return UpdateGroupToPickRender(record)	
        case 'UpdateGroupSize':
            return UpdateGroupSizeRender(record)
        case 'UpdateGroupingThreshold':
            return UpdateGroupingThresholdRender(record)	
        case 'UpdateGroupMaturityPeriod':
            return UpdateGroupMaturityPeriodRender(record)
        case 'UpdateBootstrapCommitDuration':
            return UpdateBootstrapCommitDurationRender(record)	
        case 'UpdateBootstrapRevealDuration':
            return UpdateBootstrapRevealDurationRender(record)
        case 'UpdatebootstrapStartThreshold':
            return UpdatebootstrapStartThresholdRender(record)
        case 'UpdatePendingGroupMaxLife':
            return UpdatePendingGroupMaxLifeRender(record)
        case 'GuardianReward':
            return GuardianRewardRender(record)
        default:
            return { text }
    }
}

const LogUpdateRandomRender = (record) => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Last Randomness</span>
            <span className="column-text">{record.lastRandomness}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Dispatched GroupId</span>
            <span className="column-text">{record.dispatchedGroupId}</span>
        </div>
    </div>
}
const LogInsufficientWorkingGroupRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Working Groups</span>
            <span className="column-text  text-number">{record.numWorkingGroups}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Pending Groups</span>
            <span className="column-text  text-number">{record.numPendingGroups}</span>
        </div>
    </div>
}
const LogGroupingRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">GroupId</span>
            <span className="column-text ">{record.groupId}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Nodes</span>
            <span className="column-text">
                {
                    record.nodeId.map(node => {
                        return <p key={node} className="nodes-item"><Icon style={{ fontSize: 13 }} type="tag" /> - {node}</p>
                    })
                }
            </span>
        </div>
    </div>
}

const LogRequestUserRandomRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">RequestId</span>
            <span className="column-text">
                <span className="text--ellipsis ellipsis--mid">
                    {record.requestId}
                </span>
            </span>
        </div>
        <div className="custom-column">
            <span className="column-title">Last System Randomness</span>
            <span className="column-text">
                <span className="text--ellipsis ellipsis--mid">                             {record.lastSystemRandomness}
                </span>
            </span>
        </div>
        <div className="custom-column">
            <span className="column-title">User Seed</span>
            <span className="column-text">{record.userSeed}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Dispatched GroupId</span>
            <span className="column-text ">{record.dispatchedGroupId}</span>
        </div>
    </div>
}
const LogGroupingInitiatedRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Pending Node Pool</span>
            <span className="column-text  text-number">{record.pendingNodePool}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Group Size</span>
            <span className="column-text  text-number">{record.groupSize}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Grouping Threshold</span>
            <span className="column-text  text-number">{record.groupingThreshold}</span>
        </div>
    </div>
}
const GuardianRewardRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Guardian</span>
            <span className="column-text">{record.guardian}</span>
        </div>
    </div>
}

const LogPublicKeyAcceptedRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">GroupId</span>
            <span className="column-text ">{record.groupId}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Working Groups</span>
            <span className="column-text  text-number">{record.numWorkingGroups}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">PubKeys</span>
            <span className="column-text">
                {
                    record.pubKey.map(key => {
                        return <p key={key} ><Icon style={{ fontSize: 13 }} type="tag" /> - {key}</p>
                    })
                }
            </span>
        </div>
    </div>
}

const LogPublicKeySuggestedRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">GroupId</span>
            <span className="column-text ">{record.groupId}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">PubKey Count</span>
            <span className="column-text  text-number">{record.pubKeyCount}</span>
        </div>
    </div>
}

const LogUrlRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">GroupId</span>
            <span className="column-text ">{record.dispatchedGroupId}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">QueryId</span>
            <span className="column-text ">{record.queryId}</span>
        </div>
	    <div className="custom-column">
            <span className="column-title">TiemOut</span>
            <span className="column-text ">{record.timeOut}</span>
        </div>
	    <div className="custom-column">
            <span className="column-title">DataSource</span>
            <span className="column-text ">{record.dataSource}</span>
        </div>
	    <div className="custom-column">
            <span className="column-title">Selector</span>
            <span className="column-text ">{record.selector}</span>
        </div>
	    <div className="custom-column">
            <span className="column-title">Randomness</span>
            <span className="column-text ">{record.randomness}</span>
        </div>
    </div>
}

const LogGroupDissolveRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">GroupId</span>
            <span className="column-text ">{record.groupId}</span>
        </div>
    </div>
}

const LogNonSupportedTypeRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">InvalidSelector</span>
            <span className="column-text ">{record.invalidSelector}</span>
        </div>
    </div>
}

const LogNonContractCallRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">CallAddr</span>
			 <p key={record.callAddr} className="nodes-item"><Icon style={{ fontSize: 13 }} type="tag" /> - {record.callAddr}</p>
        </div>
    </div>
}

const LogCallbackTriggeredForRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">CallbackAddr</span>
			<p key={record.callbackAddr} className="nodes-item"><Icon style={{ fontSize: 13 }} type="tag" /> - {record.callbackAddr}</p>
        </div>
    </div>
}

const LogInsufficientPendingNodeRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Number Of Pending Nodes</span>
            <span className="column-text ">{record.numPendingNodes}</span>
        </div>
    </div>
}

const LogRegisteredNewPendingNodeRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Node</span>
            <span className="column-text ">{record.node}</span>
        </div>
    </div>
}

const LogPendingGroupRemovedRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">GroupId</span>
            <span className="column-text ">{record.groupId}</span>
        </div>
    </div>
}

const LogNoPendingGroupRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">GroupId</span>
            <span className="column-text ">{record.groupId}</span>
        </div>
    </div>
}

const LogErrorRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Error Message</span>
            <span className="column-text ">{record.err}</span>
        </div>
    </div>
}

const UpdateGroupToPickRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Old Number</span>
            <span className="column-text ">{record.oldNum}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">New Number</span>
            <span className="column-text ">{record.newNum}</span>
        </div>
    </div>
}

const UpdateGroupSizeRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Old Size</span>
            <span className="column-text ">{record.oldSize}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">New Size</span>
            <span className="column-text ">{record.newSize}</span>
        </div>
    </div>
}

const UpdateGroupingThresholdRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Old Threshold</span>
            <span className="column-text ">{record.oldThreshold}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">New Threshold</span>
            <span className="column-text ">{record.newThreshold}</span>
        </div>
    </div>
}

const UpdateGroupMaturityPeriodRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Old Period</span>
            <span className="column-text ">{record.oldPeriod}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">New Period</span>
            <span className="column-text ">{record.newPeriod}</span>
        </div>
    </div>
}

const UpdateBootstrapCommitDurationRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Old Duration</span>
            <span className="column-text ">{record.oldDuration}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">New Duration</span>
            <span className="column-text ">{record.newDuration}</span>
        </div>
    </div>
}

const UpdateBootstrapRevealDurationRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Old Duration</span>
            <span className="column-text ">{record.oldDuration}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">New Duration</span>
            <span className="column-text ">{record.newDuration}</span>
        </div>
    </div>
}

const UpdatebootstrapStartThresholdRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Old Threshold</span>
            <span className="column-text ">{record.oldThreshold}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">New Threshold</span>
            <span className="column-text ">{record.newThreshold}</span>
        </div>
    </div>
}

const UpdatePendingGroupMaxLifeRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Old LifeBlocks</span>
            <span className="column-text ">{record.oldLifeBlocks}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">New LifeBlocks</span>
            <span className="column-text ">{record.newLifeBlocks}</span>
        </div>
    </div>
}

const LogValidationResultRender = record => {
    return <div className='custom-column--wrapper'>
        <div className="custom-column">
            <span className="column-title">Traffic Type</span>
			 <span className="column-text ">{record.trafficType}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Traffic ID</span>
			 <span className="column-text ">{record.trafficId}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Message</span>
			 <span className="column-text ">{record.message}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Pass</span>
			 <span className="column-text ">{ String(record.pass)}</span>
        </div>
        <div className="custom-column">
            <span className="column-title">Signature</span>
            <span className="column-text">
                {
                    record.signature.map(sign => {
                        return <p key={sign} ><Icon style={{ fontSize: 13 }} type="tag" /> - {sign}</p>
                    })
                }
            </span>
        </div>
        <div className="custom-column">
            <span className="column-title">PubKeys</span>
            <span className="column-text">
                {
                    record.pubKey.map(key => {
                        return <p key={key} ><Icon style={{ fontSize: 13 }} type="tag" /> - {key}</p>
                    })
                }
            </span>
        </div>
    </div>
}