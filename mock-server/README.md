# API

## Explorer

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
