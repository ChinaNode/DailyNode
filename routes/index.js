'use strict'
var mount = require('koa-mount')
var Router = require('koa-router')
var Post = require('../models/post')
var User = require('../models/user')
var h = require('../util/helper')

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

/*
*   index page
*/
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

/*
*
*/
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

/*
*
*/
IndexRouter.post('/submit', function * () {
    var params = this.request.body.fields
    if (params.title && params.url) {
        yield Post.tcreate({title: params.title, link: params.url})  // info need to be complete
        this.redirect('/submitsuccess')
    } else {
        this.redirect('/submit')
    }
})


IndexRouter.post('/post/submit', function * () {
    var params = this.request.body.fields
    if (params.title && params.link) {
        yield Post.tcreate({title: params.title, link: params.link})
        this.body = {code: 0, message: 'Success'}
    } else {
        this.body = {code: 1, message: 'Lack necessary params'}
    }
})

/*
*
*/
IndexRouter.get('/about', function * () {
    yield this.render('about')
})

/*
*
*/
IndexRouter.get('/submit', function * () {
    yield this.render('submit')
})

/*
*
*/
IndexRouter.get('/submitsuccess', function * () {
    yield this.render('submitSuccess')
})

/*
*
*/
IndexRouter.get('/login', function * () {
    yield this.render('login', {
        layout: 'lr',
        error: this.flash.error || ''
    })
})

/*
*
*/
IndexRouter.get('/logout', function * () {
    this.session.user = null
    this.redirect('/')
})


/*
*
*/
IndexRouter.post('/login', function * () {
    var params = this.request.body.fields
    var data = {
        email: params.email,
        pwd: h.md5(params.password)
    }
    var user = yield User.tfindOne(data)
    if (user) {
        this.session.user = user
        this.redirect('/')
    } else {
        this.flash = {error: 'User not exist or password wrong !'}
        this.redirect('/login')
    }
})

/*
*
*/
IndexRouter.get('/register', function * () {
    yield this.render('register', {
        layout: 'lr',
        error: this.flash.error || ''
    })
})

/*
*
*/
IndexRouter.post('/register', function * () {
    var params = this.request.body.fields
    var name = params.name
    var email = params.email
    var query = {$or: [{name: name}, {email: email}]}
    var user = yield User.tfindOne(query)
    if (user) {
        this.flash = {error: "This name or email already have been used !"}
        this.redirect('/register')
    } else {
        var data = {
            name: name,
            email: email,
            pwd: h.md5(params.password)
        }
        var newuser = yield User.tcreate(data)
        this.session.user = newuser
        this.redirect('/')
    }
})


IndexRouter.get('/test', function * () {
    try{
        var user = yield User.tcreate({name: 'hello', pwd: 'helloo', email: 'hello@some.com'})
        this.body = {message: 'some message'}
    }catch(e){
        this.body = {message: e.message}
    }
})