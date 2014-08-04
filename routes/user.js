'use strict'
var Router = require('koa-router')
var UserRouter = new Router()
var User = require('../models/user')
var h = require('../util/helper')
module.exports = UserRouter

/**
*
*/
UserRouter.get('/login', function * () {
    yield this.render('login', {layout: 'L'})
})

/*
*
*/
UserRouter.post('/login', function * () {
    var params = this.request.body.fields
    var query = {name: params.account, pwd: h.md5(params.password)}
    var user = yield User.tfindOne(query)
    var url
    if (user) {
        url = '/admin'
        this.session.user = user
    } else {
        url = '/user/login'    // TODO if login failed should give user the message
    }
    this.redirect(url)
})

/*
*   Logout
*/
UserRouter.delete('/logout', function * () {
    this.session.user = null
    this.redirect('/user/login')
})

/*
*   Get logout
*/
UserRouter.get('/logout', function * () {
    this.session.user = null
    this.redirect('/user/login')
})

