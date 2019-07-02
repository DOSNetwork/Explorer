exports.events = {
    'events|100': [{
        txHash: /Ox([0-9][A-Z]){10}/,
        "method|1": ['requsest Random(xxxx)', 'trigger Callback(xxxx)', 'delegate(xxxx)', 'xxxxxxxxx'],
        "eventLog|1": ['log(xxxxxx)']
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
