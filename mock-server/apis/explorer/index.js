var router = require('koa-router')();
var entities = require('../../entities/index.js');
const Mock = require('mockjs');
router.get('/search', async (ctx, next) => {
    let body = Mock.mock(entities.dos.events)
    let events = body.events
    let filteredEvents = events.map(({
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
        blkNum,
        guardian,
        groupId,
        nodeId
    }) => {
        let standart = {
            txHash,
            method,
            eventLog
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
                blkNum,
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
        return standart
    })
    let {
        pageSize,
        pageIndex,
        text
    } = ctx.query;
    console.log(`参数:text:${text},pageIndex:${pageIndex},pageSize:${pageSize}`)

    ctx.body = {
        events: filteredEvents,
        totalCount: pageSize * (5 + parseInt(pageIndex))
    }
    setTimeout(() => {
        next();
    }, 2000);
});

module.exports = router
