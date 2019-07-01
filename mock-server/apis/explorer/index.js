var router = require('koa-router')();
var entities = require('../../entities/index.js');
const Mock = require('mockjs');
router.get('/search', async (ctx, next) => {
    let body = Mock.mock(entities.dos.events)
    ctx.body = body
    setTimeout(() => {
        next();
    }, 2000);
});

module.exports = router
