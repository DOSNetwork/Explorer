var router = require('koa-router')();
var demoApi = require('./demo/index.js');
var explorerApi = require('./explorer/index')
var nodeApi = require('./node/index');
var accountApi = require('./account/index');
router.use('/demo', demoApi.routes(), demoApi.allowedMethods())
router.use('/explorer', explorerApi.routes(), explorerApi.allowedMethods())
router.use('/node', nodeApi.routes(), nodeApi.allowedMethods())
router.use('/account', accountApi.routes(), accountApi.allowedMethods())
module.exports = router;
