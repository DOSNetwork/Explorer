const Koa = require('koa');
const Router = require('koa-router');
const morgan = require('koa-morgan');
const config = require('./config');
const app = new Koa();
const router = new Router();
const api = require('./apis/index.js');
const apiWrapperMiddle = require('./middleware/api-wrapper');
// request loger
app.use(morgan('dev'))
// middle
app.use(apiWrapperMiddle)

// api
router.use('', api.routes(), api.allowedMethods())
app.use(router.routes()).use(router.allowedMethods());

// start
app.listen(config.port);

// console.log('mock server start....');
