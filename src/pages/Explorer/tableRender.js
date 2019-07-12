import React from 'react';
import { Icon } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Message from '../../util/message'
export const TxHashRender = (text, record, index) => {
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
export const MoreInfoRender = (text, record, index) => {
    switch (record.eventLog) {
        case 'LogUpdateRandom':
            return LogUpdateRandomRender(record)
        case 'LogInsufficientWorkingGroup':
            return LogInsufficientWorkingGroupRender(record)
        case 'LogGrouping':
            return LogGroupingRender(record)
        case 'LogRequestUserRandom':
            return LogRequestUserRandomRender(record)
        case 'LogGroupingInitiated':
            return LogGroupingInitiatedRender(record)
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
