var router = require('koa-router')();
var entities = require('../../entities/index.js');
const Mock = require('mockjs');
router.get('/getdata', async (ctx, next) => {
    let body = Mock.mock(entities.demo.data)
    ctx.body = body
    next();
});

module.exports = router
