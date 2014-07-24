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
        skip: (page-1)*num
    }
    var posts = yield Post.findC(query, null, opts)
    var count = yield Post.countC(query)
    var totalPage = Math.ceil(count / num)
    yield this.render('posts', {
        layout: 'BL',
        posts: posts,
        curPage: page,
        totalPage: totalPage
    })
})


PostRouter.get('/:id', auth, function * () {
    var id = this.params.id
    var post = yield Post.findByIdC(id)
    this.body = post
})

PostRouter.get('/del/:id', auth, function * () {
    var id = this.params.id
    yield Post.updateC({_id: id}, {$set: {hidden: true}})
    this.redirect('/post')
})

PostRouter.put('/:id', auth, function * () {
    
})

module.exports = PostRouter
