var router = require('koa-router')();
var entities = require('../../entities/index.js');
const Mock = require('mockjs');
router.get('/list', async (ctx, next) => {
    let body = Mock.mock(entities.dos.nodelist)
    ctx.body = body
    setTimeout(() => {
        next();
    }, 2000);
});


router.get('/detail', async (ctx, next) => {
    let body = Mock.mock(entities.dos.nodedetail)
    ctx.body = body
    setTimeout(() => {
        next();
    }, 2000);
});

module.exports = router
