'use strict'
var mount = require('koa-mount')
var Router = require('koa-router')
var Post = require('../models/post')

// require all routers
var IndexRouter = new Router()
var UserRouter = require('./user')
var AdminRouter = require('./admin')
var PostRouter = require('./post')

// 
module.exports = function (app) {
    app.use(mount(IndexRouter.middleware()))
    app.use(mount('/user', UserRouter.middleware()))
    app.use(mount('/admin', AdminRouter.middleware()))
    app.use(mount('/post', PostRouter.middleware()))
}

// index page
IndexRouter.get('/', function * () {
    var query = {recommend: true, hidden: false}
    if(this.query.keyword)
        query.title = new RegExp(this.query.keyword, 'i')
    var opts = {
        limit: 10,
        skip: 0,
        sort: {pubDate: -1}
    }
    var posts = yield Post.tfind(query, null, opts)
    yield this.render('index', {posts: posts})
})


IndexRouter.get('/all', function * () {
    var query = {hidden: false}
    if(this.query.keyword)
        query.title = new RegExp(this.query.keyword, 'i')
    var opts = {
        limit: 10,
        skip: 0,
        sort: {pubDate: -1}
    }
    var posts = yield Post.tfind(query, null, opts)
    yield this.render('index', {posts: posts})
})

IndexRouter.get('/about', function * () {
    yield this.render('about')
})


IndexRouter.get('/submit', function * () {
    yield this.render('submit')
})

IndexRouter.get('/submitsuccess', function * () {
    yield this.render('submitSuccess')
})


IndexRouter.post('/submit', function * () {
    var params = this.request.body.fields
    if (params.title && params.url) {
        yield Post.tcreate({title: params.title, link: params.url})  // info need to be complete
        this.redirect('/submitsuccess')
    } else {
        this.redirect('/submit')
    }
})

