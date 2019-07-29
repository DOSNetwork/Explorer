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
    'group|2': [{
        "groupId": HexIdMock,
        "nodeId|5": [HexIdMock],
        "pubKey|5": [HexIdMock],
        "acceptedBlknum": NumberMock,
        "dissolvedBlknum": NumberMock,
        "urlRequests": NumberMock,
        "randomRequests": NumberMock
    }],
    'random|2': [{
        "requestId": HexIdMock,
        "dispatchedGroupId": HexIdMock,
        "submitter": HexIdMock,
        "submittedBlkNum": NumberMock,
        "submittedTxHash": HexIdMock,
        "message": "{\"amount\":\"269.585\",\"base\":\"ETH\",\"currency\":\"USD\"}\ufffd\u0019(\ufffdj\ufffd\u0005\ufffd\ufffdT\ufffd0\ufffd\\\u001c\ufffd\ufffd9\ufffd\u0010",
        "signature|2": [HexIdMock],
        "pubKey|5": [HexIdMock],
        "pass|1": true,
        "lastSystemRandomness": HexIdMock,
        "userSeed": HexIdMock
    }],
    'url|2': [{
        "requestId": HexIdMock,
        "dispatchedGroupId": HexIdMock,
        "submitter": HexIdMock,
        "submittedBlkNum": NumberMock,
        "submittedTxHash": HexIdMock,
        "message": "{\"amount\":\"269.585\",\"base\":\"ETH\",\"currency\":\"USD\"}\ufffd\u0019(\ufffdj\ufffd\u0005\ufffd\ufffdT\ufffd0\ufffd\\\u001c\ufffd\ufffd9\ufffd\u0010",
        "signature|2": [HexIdMock],
        "pubKey|5": [HexIdMock],
        "pass|1": true,
        "timeOut": NumberMock,
        "dataSource": "https://api.coinbase.com/v2/prices/ETH-USD/spot",
        "selector": "$.data",
        "randomness": HexIdMock
    }],
    "address|2": [{
        "addr": HexIdMock,
        "balance|0-5.1-5": 1,
        "registerState|1": true,
        "activeGroups|5": [HexIdMock],
        "expiredGroups": NumberMock,
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
