var router = require('koa-router')();
var apiv1 = require('./api-v1');

router.use('/api', apiv1.routes(), apiv1.allowedMethods())

module.exports = router;
