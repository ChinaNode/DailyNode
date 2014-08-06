'use strict'
var mount = require('koa-mount')
var Router = require('koa-router')
var Post = require('../models/post')

// require all routers
var IndexRouter = new Router()
var UserRouter = require('./user')
var AdminRouter = require('./admin')
var PostRouter = require('./post')

// index page
IndexRouter.get('/', function * () {
    var query = {hidden: false}
    var opts = {
        limit: 10,
        skip: 0,
        sort: {pubDate: -1}
    }
    var posts = yield Post.tfind(query, null, opts)
    yield this.render('index', {posts: posts})
})

// 
module.exports = function (app) {
    app.use(mount(IndexRouter.middleware()))
    app.use(mount('/user', UserRouter.middleware()))
    app.use(mount('/admin', AdminRouter.middleware()))
    app.use(mount('/post', PostRouter.middleware()))
}
