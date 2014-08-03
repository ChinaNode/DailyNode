'use strict'
var Router = require('koa-router')
var PostRouter = new Router()
var auth = require('../util/auth').auth
var Post = require('../models/post')

PostRouter.get('/', auth, function * () {
    // get page params
    var page = parseInt(this.query.page || '1')
    var num = parseInt(this.query.num || '10')
    var query = {hidden: false}
    var opts = {
        limit: num,
        skip: (page-1)*num,
        sort: {createdTime: -1}
    }
    var posts = yield Post.tfind(query, null, opts)
    console.log(posts)
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

PostRouter.get('/:id', auth, function * () {
    var id = this.params.id
    var post = yield Post.tfindById(id)
    yield this.render('post_detail', {
        layout: 'BL',
        post: post
    })
})

PostRouter.get('/del/:id', auth, function * () {
    var id = this.params.id
    yield Post.tupdate({_id: id}, {$set: {hidden: true}})
    this.redirect('/post')
})

PostRouter.put('/:id', auth, function * () {
    
})

module.exports = PostRouter
