var router = require('koa-router')();
var demoApi = require('./demo/index.js');
var explorerApi = require('./explorer/index')
var nodeApi = require('./node/index');
router.use('/demo', demoApi.routes(), demoApi.allowedMethods())
router.use('/explorer', explorerApi.routes(), explorerApi.allowedMethods())
router.use('/node', nodeApi.routes(), nodeApi.allowedMethods())
module.exports = router;
