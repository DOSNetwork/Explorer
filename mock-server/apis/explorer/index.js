var router = require('koa-router')();
var entities = require('../../entities/index.js');
const Mock = require('mockjs');
router.get('/search', async (ctx, next) => {
    let body = Mock.mock(entities.dos.events)
    let events = body.events
    let group = body.group
    let request = body.request
    let address = body.address
    let filteredEvents = events.map(({
        ID,
        txHash,
        method,
        eventLog,
        lastRandomness,
        dispatchedGroupId,
        numWorkingGroups,
        numPendingGroups,
        requestId,
        lastSystemRandomness,
        userSeed,
        pendingNodePool,
        groupSize,
        groupingThreshold,
        blockNumber,
        guardian,
        groupId,
        nodeId,
        pubKey
    }) => {
        let standart = {
            ID,
            txHash,
            method,
            eventLog,
            blockNumber
        }
        if (eventLog === 'LogUpdateRandom') {
            return {
                ...standart,
                lastRandomness,
                dispatchedGroupId
            }
        }
        if (eventLog === 'LogInsufficientWorkingGroup') {
            return {
                ...standart,
                numWorkingGroups,
                numPendingGroups
            }
        }
        if (eventLog === 'LogRequestUserRandom') {
            return {
                ...standart,
                requestId,
                lastSystemRandomness,
                userSeed,
                dispatchedGroupId
            }
        }
        if (eventLog === 'LogGroupingInitiated') {
            return {
                ...standart,
                pendingNodePool,
                groupSize,
                groupingThreshold
            }
        }
        if (eventLog === 'GuardianReward') {
            return {
                ...standart,
                guardian
            }
        }
        if (eventLog === 'LogGrouping') {
            return {
                ...standart,
                groupId,
                nodeId
            }
        }
        if (eventLog === 'LogPublicKeyAccepted') {
            return {
                ...standart,
                groupId,
                pubKey,
                numWorkingGroups
            }
        }
        return standart
    })
    let {
        pageSize,
        pageIndex,
        text
    } = ctx.query;

    console.log(`参数:text:${text},pageIndex:${pageIndex},pageSize:${pageSize}`)

    if (text.includes('request')) {
        ctx.body = {
            request: request,
            totalCount: 1
        }
    } else if (text.includes('group')) {
        ctx.body = {
            group: group,
            totalCount: 1
        }
    } else if (text.includes('address')) {
        ctx.body = {
            address: address,
            totalCount: 1
        }
    } else {
        ctx.body = {
            events: filteredEvents,
            totalCount: pageSize * (5 + parseInt(pageIndex))
        }
    }


    setTimeout(() => {
        next();
    }, 2000);
});

module.exports = router
