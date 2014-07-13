var mount = require('koa-mount')
var Router = require('koa-router')

// require all routers
var IndexRouter = new Router()
var UserRouter = require('./user')
var AdminRouter = require('./admin')

// index page
IndexRouter.get('/', function * () {
    yield this.render('index')
})

// 
module.exports = function (app) {
    app.use(mount(IndexRouter.middleware()))
    app.use(mount('/user', UserRouter.middleware()))
    app.use(mount('/admin', AdminRouter.middleware()))
}



