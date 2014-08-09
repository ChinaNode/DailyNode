'use strict'
var Router = require('koa-router')
var PostRouter = new Router()
var auth = require('../util/auth').auth
var Post = require('../models/post')
var Category = require('../models/category')

PostRouter.get('/', auth, function * () {
    // get page params
    var page = parseInt(this.query.page || '1')
    var num = parseInt(this.query.num || '10')
    var query = {hidden: false}
    var opts = {
        limit: num,
        skip: (page-1)*num,
        sort: {pubDate: -1}
    }
    var posts = yield Post.tfind(query, null, opts)
    var count = yield Post.tcount(query)
    var totalPage = Math.ceil(count / num)
    yield this.render('posts', {
        layout: 'BL',
        posts: posts,
        curPage: page,
        total: count,
        totalPage: totalPage
    })
})

PostRouter.get('/recommend', auth, function * () {
    // get page params
    var page = parseInt(this.query.page || '1')
    var num = parseInt(this.query.num || '10')
    var query = {hidden: false, recommend: true}
    var opts = {
        limit: num,
        skip: (page-1)*num,
        sort: {pubDate: -1}
    }
    var posts = yield Post.tfind(query, null, opts)
    var count = yield Post.tcount(query)
    var cates = yield Category.tfind()
    var totalPage = Math.ceil(count / num)
    yield this.render('recommend', {
        layout: 'BL',
        posts: posts,
        curPage: page,
        total: count,
        totalPage: totalPage,
        cates: cates
    })
})

PostRouter.get('/:id', auth, function * () {
    var id = this.params.id
    var post = yield Post.tfindById(id)
    yield this.render('post_detail', {
        layout: 'BL',
        post: post
    })
})

PostRouter.del('/del/:id', auth, function * () {
    var id = this.params.id
    yield Post.tupdate({_id: id}, {$set: {hidden: true}})
    this.body = {code: 0, message: 'Success!'}
})

PostRouter.put('/recommend/:id', auth, function * () {
    var id = this.params.id
    yield Post.tupdate({_id: id}, {$set: {recommend: true}})
    this.body = {code: 0, message: 'Success!'}
})

PostRouter.put('/setcate/:id', auth, function * () {
    var id = this.params.id
    var params = this.request.body.fields
    var cate = params.category
    yield Post.tupdate({_id: id}, {$set: {category: cate}})
    this.body = {code: 0, message: 'Success!'}
})

module.exports = PostRouter
