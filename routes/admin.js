'use strict'
var Router = require('koa-router')
var AdminRouter = new Router()
var adminAuth = require('../util/auth').adminAuth
var Post = require('../models/post')

/*
*
*/
AdminRouter.get('/', adminAuth, function * (next) {
    yield this.render('admin', {layout: 'BL'})
})

module.exports = AdminRouter
