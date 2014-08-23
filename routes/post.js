'use strict'
var Router = require('koa-router')
var PostRouter = new Router()
var auth = require('../util/auth').adminAuth
var authJson = require('../util/auth').authJson
var Post = require('../models/post')
var Like = require('../models/likes')
var Category = require('../models/category')
var request = require('co-request')
var summary = require('node-summary')
var unfluff = require('unfluff')
var thunkify = require('thunkify')
var summarize = thunkify(summary.summarize)
var cheerio = require('cheerio')

/*
*   Post list 
*/
PostRouter.get('/', auth, function * () {
    // get page params
    var page = parseInt(this.query.page || '1')
    var num = parseInt(this.query.num || '10')
    var query = {hidden: false}
    var opts = {
        limit: num,
        skip: (page-1)*num,
        sort: {top: -1, createdTime: -1}
    }
    var posts = yield Post.tfind(query, null, opts)
    var count = yield Post.tcount(query)
    var cates = yield Category.tfind()
    var totalPage = Math.ceil(count / num)
    yield this.render('posts', {
        layout: 'BL',
        posts: posts,
        curPage: page,
        total: count,
        cates: cates,
        totalPage: totalPage
    })
})

/*
*   recommend list
*/
PostRouter.get('/recommend', auth, function * () {
    // get page params
    var page = parseInt(this.query.page || '1')
    var num = parseInt(this.query.num || '10')
    var query = {hidden: false, recommend: true}
    var opts = {
        limit: num,
        skip: (page-1)*num,
        sort: {top: -1, createdTime: -1}
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

/*
*   post detail
*/
PostRouter.get('/:id', auth, function * () {
    var id = this.params.id
    var post = yield Post.tfindById(id)
    yield this.render('post_detail', {
        layout: 'BL',
        post: post
    })
})

/*
*   post update
*/
PostRouter.put('/:id', auth, function * () {
    var params = this.request.body.fields
    var _id = params._id
    yield Post.tupdate({_id: _id}, {$set: {
        author: params.author,
        source: params.source,
        title: params.title
    }})
    this.redirect('/post/' + _id)
})

/*
*   post hide
*/
PostRouter.del('/del/:id', auth, function * () {
    var id = this.params.id
    yield Post.tupdate({_id: id}, {$set: {hidden: true}})
    this.body = {code: 0, message: 'Success!'}
})

/*
*   post recommend
*/
PostRouter.put('/recommend/:id', auth, function * () {
    var id = this.params.id
    yield Post.tupdate({_id: id}, {$set: {recommend: true}})
    this.body = {code: 0, message: 'Success!'}
})

/*
*   set category
*/
PostRouter.put('/setcate/:id', auth, function * () {
    var id = this.params.id
    var params = this.request.body.fields
    var cate = params.category
    yield Post.tupdate({_id: id}, {$set: {category: cate}})
    this.body = {code: 0, message: 'Success!'}
})

/*
*   post like
*/
PostRouter.get('/like/:id', authJson, function * () {
    var id = this.params.id
    var uName = this.session.user.name
    var liked = yield Like.tfindOne({postId: id, userName: uName})
    if (liked) {
        this.body = {code: 2, message: 'Already liked'}
    } else {
        yield Like.tcreate({postId: id, userName: uName})
        yield Post.tupdate({_id: id}, {$inc: {like: 1}})
        this.body = {code: 0, message: 'Success'}
    }
})


/*
* set post top
*/
PostRouter.put('/topdown/:id', auth, function * () {
	var id = this.params.id
	var params = this.request.body.fields
	var newval = params.now == 'up' ? 1 : 0
	yield Post.tupdate({_id: id}, {$set: {top: newval}})
	this.body = {code: 0}
})

/*
* extract content
*/
PostRouter.post('/getcontent/:id', auth, function * () {
	var id = this.params.id
	var link = this.request.body.fields.link
	try {
		var result = yield request(link)
		//var data = unfluff(result.body)
		//var summ = yield summarize(data.title, data.text)		
		var $ = cheerio.load(result.body)
		this.body = {code: 0, content: $('body').html()}
	} catch (e) {
		this.body = {code: 1, message: e.message}
	} 
})


/*
* post html preview
*/
PostRouter.get('/preview/:id', auth, function * () {
	var id = this.params.id
	var post = yield Post.tfindOne({_id: id})
	if (post) {
		var result = yield request(post.link)
		yield this.render('preview', {
			layout: 'EL', 
			content: result.body
		})
	} else {
		this.body = '<h2>Some Error</h2>'
	}
})

module.exports = PostRouter
