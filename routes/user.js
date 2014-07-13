var Router = require('koa-router')
var UserRouter = new Router()
module.exports = UserRouter

/**
*
*/
UserRouter.get('/login', function * () {
    yield this.render('login')
})

/*
*
*/
UserRouter.post('/login', function * () {

})

/*
*   Logout
*/
UserRouter.delete('/logout', function * () {

})


UserRouter.get('/test', function * () {
    // koa-session test
    var n = this.session.views || 0
    this.session.views = ++n
    this.body = n + ' views'
})
