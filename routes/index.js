'use strict'
var mount = require('koa-mount')
var Router = require('koa-router')
var Post = require('../models/post')

// require all routers
var IndexRouter = new Router()
var UserRouter = require('./user')
var AdminRouter = require('./admin')
var PostRouter = require('./post')
var CategoryRouter = require('./category')

// 
module.exports = function (app) {
    app.use(mount(IndexRouter.middleware()))
    app.use(mount('/user', UserRouter.middleware()))
    app.use(mount('/admin', AdminRouter.middleware()))
    app.use(mount('/post', PostRouter.middleware()))
    app.use(mount('/category', CategoryRouter.middleware()))
}

// index page
IndexRouter.get('/', function * () {
    var page = parseInt(this.query.page || '1')
    var num = parseInt(this.query.num || '10')
    var query = {recommend: true, hidden: false}
    var skip = (page - 1) * num
    if(this.query.keyword)
        query.title = new RegExp(this.query.keyword, 'i')
    var opts = {
        limit: num,
        skip: skip,
        sort: {createdTime: -1}
    }
    var posts = yield Post.tfind(query, null, opts)
    var count = yield Post.tcount(query)
    yield this.render('index', {
        posts: posts,
        totalCount: count,
        curPage: page,
        totalPage: Math.ceil(count / num)
    })
})


IndexRouter.get('/all', function * () {
    var page = parseInt(this.query.page || '1')
    var num = parseInt(this.query.num || '10')
    var query = {recommend: true, hidden: false}
    var skip = (page - 1) * num
    var query = {hidden: false}
    if(this.query.keyword)
        query.title = new RegExp(this.query.keyword, 'i')
    var opts = {
        limit: num,
        skip: skip,
        sort: {createdTime: -1}
    }
    var posts = yield Post.tfind(query, null, opts)
    var count = yield Post.tcount(query)
    yield this.render('index', {
        posts: posts,
        totalCount: count,
        curPage: page,
        totalPage: Math.ceil(count / num)
    })
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

