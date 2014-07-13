var Router = require('koa-router')
var AdminRouter = new Router()

AdminRouter.get('/', function * () {
    yield this.render('login')
})

module.exports = AdminRouter