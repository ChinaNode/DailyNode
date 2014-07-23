var Router = require('koa-router')
var PostRouter = new Router()
var auth = require('../util/auth').auth
var Post = require('../models/post')

PostRouter.get('/', auth, function * () {
    // get page params
    var page = parseInt(this.query.page || '1')
    var num = parseInt(this.query.num || '10')
    var query = {}
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

})

PostRouter.delete('/:id', auth, function * () {

})

PostRouter.put('/:id', auth, function * () {
    
})

module.exports = PostRouter
