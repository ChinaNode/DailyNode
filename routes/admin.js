'use strict'
var Router = require('koa-router')
var AdminRouter = new Router()
var auth = require('../util/auth').auth
var Post = require('../models/post')

/*
*
*/
AdminRouter.get('/', auth, function * (next) {
    yield this.render('admin', {layout: 'BL'})
})

module.exports = AdminRouter