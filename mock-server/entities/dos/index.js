exports.events = {
    'events|100': [{
        "ID":'@id()',
        txHash: /Ox([0-9][A-Z]){30}/,

        "method|1": ['signalRandom', 'signalGroupFormation', 'signalBootstrap'],
        "eventLog|1": ['LogUpdateRandom',
            'LogInsufficientWorkingGroup',
            'LogRequestUserRandom',
            'LogGroupingInitiated',
            'LogGrouping',
            'GuardianReward'],
        "lastRandomness":/([0-9][A-Z]){30}/,
        "dispatchedGroupId":/([0-9][A-Z]){30}/,
        "numWorkingGroups":"@integer(0,10)",
        "numPendingGroups":"@integer(0,10)",
        "requestId":/([0-9][A-Z]){30}/,
        "lastSystemRandomness":/([0-9][A-Z]){30}/,
        "userSeed":"@hex()",
        "pendingNodePool":"@integer(0,200)",
        "groupSize":"@integer(0,200)",
        "groupingThreshold":"@integer(0,200)",
        "blockNumber":"@integer(1000000,5000000)",
        "guardian":/([0-9][A-Z]){30}/,
        "groupId":/([0-9][A-Z]){30}/,
        "nodeId|5":[/([0-9][A-Z]){30}/]
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
