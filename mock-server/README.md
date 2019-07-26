# API

## Explorer
### autocomplete

**Request Url: ***/api/explorer/eventNames
Response Scheme:

```json
[
    "LogRegisteredNewPendingNode",
    "LogGrouping",
    "LogPublicKeySuggested",
    "LogPublicKeyAccepted",
    "LogGroupDissolve",
    "LogUpdateRandom",
    "LogUrl",
    "LogRequestUserRandom",
    "LogValidationResult",
    "LogCallbackTriggeredFor",
    "GuardianReward",
    "LogError"
]
```

### search

**Request Url: ***/api/explorer/search*****

Request Scheme:

```json
{
    "text":[user Input here],
    "pageSize":100,
    "pageIndex":0
}
```

Response Scheme:

```json
// http status 200
// success response
{
    "code": 0,
    "message": "success",
    "body": {
        "events": [
            {
                "txHash": "Ox7B0G1F7B7Y1M4D6L3E3S",
                "method": "delegate(xxxx)",
                "eventLog": "log(xxxxxx)"
            },
            {
                "txHash": "Ox9G8H3V1B5B3W4K9X4Q7Q",
                "method": "requsest Random(xxxx)",
                "eventLog": "log(xxxxxx)"
            },
            {
                "txHash": "Ox4J3U1D7V9G5I1O1R2D6W",
                "method": "delegate(xxxx)",
                "eventLog": "log(xxxxxx)"
            }
        ],
        "totalCount":999
    }
}
```
```json
resp  {
    "code": 0,
    "message": "success",
    "body": {
        "address": [
            {
                "addr": "0xfEa0E757b1C3c2Cd7169CC1889069B26806F2b45",
                "balance": "0.52812162",
                "registerState": true,
                "activeGroups": [
                    "0x8c1e133081aefadd46ef733cdb9453250fd009e532dccf4c14302e7ba032c884"
                ],
                "expiredGroups": 409
            }
        ],
        "totalCount": 1
    }
}
```
```json
resp  {
    "code": 0,
    "message": "success",
    "body": {
        "group": [
            {
                "groupId": "0x6eca191becad586a651b87c343f3a737cdbbeb92efec98ab91e9dbf59524b94d",
                "acceptedBlknum": 4468659,
                "dissolvedBlknum": 4480225,
                "nodeId": [
                    "0x53ED76eA82EAE533E51080d20E1D4733C1947EBA",
                    "0x4E5726AE523d3FF490e8Ab1ad09f7241CdAD88A9",
                    "0x9848B81Df34dbE28d278dA0f3DAcEC1b8098Fa3f",
                    "0xD4405c30360F736986663A887DEc8595D06E63Ea",
                    "0xe203046854a11012E78bC7Fe01e72C4093f0605E",
                    "0xe635E5c3fC5B559c3417eb889527c601597DE6F2",
                    "0x2ac0645c53Aa8651d5A4aE7060B205648370e94F",
                    "0xF55c2D0b4e89827a64937Ca863bF89Cbc0f28b04",
                    "0x1E0592C3ecf8A98abF4405E8b8AF383648bDb90A",
                    "0x2305587CB1b92E20d9b5cdb239382e43bb7838e0",
                    "0xFE2DaDFAA54eCF110D02F5b10D4C993B441a3259",
                    "0xE7B516AF6721115DFfA7D5eFfD7714A39E246440",
                    "0x47350c4E7527c0b7f199EF44C65D90285ACA5809",
                    "0xc22469D1debcE35D475e1cB52705db1e752F5bE0",
                    "0x8957bC2dDC5C6ed1118bb8AF98a37EcdEafCFa4B",
                    "0x94e67c101572ab09F1863c346786d8539EB5826B",
                    "0x9370c46B6D5AA0fbbd61BcFA6f3eAaF9cf512347",
                    "0x24c280093F1C563640b150ADd2a2aEa1F4B02C78",
                    "0x7133362B935aA5f47a1233D0b119b09b3b4b041d",
                    "0x7aa9bFCc4546935Dc2a6E8cc714cd7338344bcB6",
                    "0x0e0e6E273D30803D1BE843Eb428A5B1C6239219f"
                ],
                "pubKey": [
                    "0x02575427835728b484e3a0966277f69b9cd7d4643d0b33f48c52933768fe4dfc",
                    "0x29460478303e959965f8c8b8dde82e8d63dea6a594f2a5b05dc45226344b69a8",
                    "0x04dbc7c3c2f5bc255eea8ecc2945d0fc5a00ed84526209c4b8a5ef7c73a60f93",
                    "0x187eb0c1be9a423d86a5b7b8a0eb01a7494d48bf00115b57436cd2da69d74d63"
                ],
                "urlRequests": 5,
                "randomRequests": 0
            }
        ],
        "totalCount": 1
    }
}
```
```json
resp  {
    "code": 0,
    "message": "success",
    "body": {
        "url": [
            {
                "requestId": "0x5c42e9d87d2406a855081c0524a9d1fb50e915a7becf6ade793e2433a122339d",
                "dispatchedGroupId": "0x3bd6589659082e854afc00f4f42222ebc23193c1ef42d5ed6cf3ccf00df21ecb",
                "submitter": "0xdD1928956AdE05d2da54c230f75c1Cd7ed39ea10",
                "submittedBlkNum": 4468936,
                "submittedTxHash": "0xb7f8696e9bdad17c8a20fcc7f3f882e9c7506c095c663870b765b4b744af94e5",
                "message": "{\"amount\":\"269.585\",\"base\":\"ETH\",\"currency\":\"USD\"}\ufffd\u0019(\ufffdj\ufffd\u0005\ufffd\ufffdT\ufffd0\ufffd\\\u001c\ufffd\ufffd9\ufffd\u0010",
                "signature": [
                    "0x2758f8d1012d749aba1ad142d4b44ab5abaf8b42891e56da5b757d2b081c805f",
                    "0x08f7050f78b57a093bc1b779e980fe327e57a243e40cbeb193c1c7bbafc5e963"
                ],
                "pubKey": [
                    "0x2d1c40d16790668ff1877b1f4f17627c554bff5a3ef6d694ee03fa3cc2804bdd",
                    "0x1c7e60ade75491f66248061803c438caa39476c072e081fe08086ab5a3e7e767",
                    "0x1d905cb5d4a66c2f2ac88fd1a7cb1796d4e5028dea400babcc998d2587e3a6ad",
                    "0x0556b82a5b3e7f8934c09aba4b2bf968c3aae71a4f8ee3b11c72b02da98a110e"
                ],
                "pass": true,
                "timeOut": "28",
                "dataSource": "https://api.coinbase.com/v2/prices/ETH-USD/spot",
                "selector": "$.data",
                "randomness": "0xcb42637fd4aa8998693a7ec871bbc4ad5ecf3d35563a1e4b6e2d3325afc7b246"
            }
        ],
        "totalCount": 1
    }
}
```
```json
resp  {
    "code": 0,
    "message": "success",
    "body": {
        "random": [
            {
                "requestId": "0x5c42e9d87d2406a855081c0524a9d1fb50e915a7becf6ade793e2433a122339d",
                "dispatchedGroupId": "0x3bd6589659082e854afc00f4f42222ebc23193c1ef42d5ed6cf3ccf00df21ecb",
                "submitter": "0xdD1928956AdE05d2da54c230f75c1Cd7ed39ea10",
                "submittedBlkNum": 4468936,
                "submittedTxHash": "0xb7f8696e9bdad17c8a20fcc7f3f882e9c7506c095c663870b765b4b744af94e5",
                "message": "0xcb42637fd4aa8998693a7ec871bbc4ad5ecf3d35563a1e4b6e2d3325afc7b246",
                "signature": [
                    "0x2758f8d1012d749aba1ad142d4b44ab5abaf8b42891e56da5b757d2b081c805f",
                    "0x08f7050f78b57a093bc1b779e980fe327e57a243e40cbeb193c1c7bbafc5e963"
                ],
                "pubKey": [
                    "0x2d1c40d16790668ff1877b1f4f17627c554bff5a3ef6d694ee03fa3cc2804bdd",
                    "0x1c7e60ade75491f66248061803c438caa39476c072e081fe08086ab5a3e7e767",
                    "0x1d905cb5d4a66c2f2ac88fd1a7cb1796d4e5028dea400babcc998d2587e3a6ad",
                    "0x0556b82a5b3e7f8934c09aba4b2bf968c3aae71a4f8ee3b11c72b02da98a110e"
                ],
                "pass": true,
                "lastSystemRandomness": "0xcb42637fd4aa8998693a7ec871bbc4ad5ecf3d35563a1e4b6e2d3325afc7b246",
                "userSeed": "0xcb42637fd4aa8998693a7ec871bbc4ad5ecf3d35563a1e4b6e2d3325afc7b246"
            }
        ],
        "totalCount": 1
    }
}
```
```json
// http status 200
// error response
{
    "code":[errorCode],
    "message":"error message here!"
}
```


## Node

### node list

**Request Url: ***/api/node/list*****

Request Scheme:

```json
{
    "pageSize":100,
    "pageIndex":0
}
```


Response Scheme:

```json
// http status 200
// success response
{
    "code": 0,
    "message": "success",
    "body": {
        "nodelist": [
            {
                "avatar": "http://dummyimage.com/'25x25'/7983f2",
                "node": "dosOx6W7C3J9N8J3V6C4R6G1P",
                "selfStaked": 37138,
                "totalDelegated": 97789,
                "rewardCut": 79,
                "totalRewards": 972.3542411482556,
                "uptime": 3,
                "myDelegation": 893,
                "myRewards": 74
            },
            {
                "avatar": "http://dummyimage.com/'25x25'/a6f279",
                "node": "dosOx4Q4V8Q5B1I3I2P0D1M5D",
                "selfStaked": 29887,
                "totalDelegated": 85417,
                "rewardCut": 69,
                "totalRewards": 530.9130661083033,
                "uptime": 6,
                "myDelegation": 644,
                "myRewards": 31
            }
        ]
    }
}
```

```json
// http status 200
// error response
{
    "code":[errorCode],
    "message":"error message here!"
}
```

### node detail

**Request Url: ***/api/node/detail*****

Request Scheme:

```json
{
    "address":"0x6635F83421Bf059cd8111f180f0727128685BaE4"
}
```


Response Scheme:

```json
// http status 200
// success response
{
    "code": 0,
    "message": "success",
    "body": {
        "nodedetail": {
            "node": "dosOx0I1I0U7O7C8M1K5Z6P8I",
            "avatar": "http://dummyimage.com/'90x90'/79f2d2",
            "nodeAddress": "dosOx2Y5F5E4K1N1L4I2Z8K9Z",
            "nodeDescription": "telnet://ofphwjqgs.at/hqp",
            "selfStaked": 33961,
            "totalDelegated": 65934,
            "rewardCut": 64,
            "totalRewards": 1534.859294106,
            "uptime": 11
        }
    }
}
```

```json
// http status 200
// error response
{
    "code":[errorCode],
    "message":"error message here!"
}
```
