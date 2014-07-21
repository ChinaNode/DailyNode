var Router = require('koa-router')
var AdminRouter = new Router()
var auth = require('../util/auth').auth

AdminRouter.get('/', auth, function * () {
    yield this.render('admin', {layout: 'BL'})
})

module.exports = AdminRouter