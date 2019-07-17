const HexIdMock = /0x([0-9][A-F]){20}/
const NumberMock = "@integer(0,50000)"
exports.events = {
    'events|100': [{
        "ID": '@id()',
        txHash: HexIdMock,

        "method|1": ['signalRandom', 'signalGroupFormation', 'signalBootstrap'],
        "eventLog|1": ['LogUpdateRandom',
            'LogInsufficientWorkingGroup',
            'LogRequestUserRandom',
            'LogGroupingInitiated',
            'LogGrouping',
            'GuardianReward', 'LogPublicKeyAccepted'
        ],
        "lastRandomness": HexIdMock,
        "dispatchedGroupId": HexIdMock,
        "numWorkingGroups": "@integer(0,10)",
        "numPendingGroups": "@integer(0,10)",
        "requestId": HexIdMock,
        "lastSystemRandomness": HexIdMock,
        "userSeed": "@hex()",
        "pendingNodePool": "@integer(0,200)",
        "groupSize": "@integer(0,200)",
        "groupingThreshold": "@integer(0,200)",
        "blockNumber": "@integer(1000000,5000000)",
        "guardian": HexIdMock,
        "groupId": HexIdMock,
        "nodeId|5": [HexIdMock],
        "pubKey|5": [HexIdMock]
    }],
    'address': {
        address: HexIdMock,
        balance: "@integer(1000000,5000000)",
        "groupId|5": [HexIdMock]
    },
    'groups|2': [{
        "groupId": HexIdMock,
        "groupMembers|5": [HexIdMock],
        "groupPubKey|5": [HexIdMock],
        "startedBlockNumber": NumberMock,
        "suggestedBlockNumber|5": [NumberMock],
        "acceptedBlockNumber": NumberMock,
        "resolvedBlockNumber": NumberMock
    }]
}

exports.nodelist = {
    'nodelist|100': [{
        avatar: "@image('25x25',@hex)",
        node: /dosOx([0-9][A-Z]){10}/,
        selfStaked: '@integer(10000,60000)',
        totalDelegated: '@integer(60000,150000)',
        rewardCut: '@integer(0,100)',
        totalRewards: '@float(0, 3000, 2)',
        uptime: '@integer(0,30)',
        myDelegation: '@integer(0,1000)',
        myRewards: '@integer(0,100)'
    }]
}


exports.nodedetail = {
    nodedetail: {
        node: /dosOx([0-9][A-Z]){10}/,
        avatar: "@image('90x90',@hex)",
        nodeAddress: /dosOx([0-9][A-Z]){10}/,
        nodeDescription: '@url()',
        selfStaked: '@integer(10000,60000)',
        totalDelegated: '@integer(60000,150000)',
        rewardCut: '@integer(0,100)',
        totalRewards: '@float(0, 3000, 2)',
        uptime: '@integer(0,30)',
    }
}

exports.activities = {
    'activities|10': [{
        time: '@datetime()',
        txHash: /Ox([0-9][A-Z]){10}/,
        'action|1': ['Delegated 2,500 DOS to 0X0…FF', 'Unbond 200 DOS from 0X0…FF, withdraw…', 'Reward Withdraw 10 DOS']
    }]
}
