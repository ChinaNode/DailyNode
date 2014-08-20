'use strict'
var mount = require('koa-mount')
var Router = require('koa-router')
var Post = require('../models/post')
var User = require('../models/user')
var h = require('../util/helper')
var createSM = require('../util/sitemap')
var request = require('co-request')
var path = require('path')
var fs = require('co-fs')
var urlHelper = require('url')
var cheerio = require('cheerio')

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
    if (this.query.keyword)
        query.title = new RegExp(this.query.keyword, 'i')
    var opts = {
        limit: num,
        skip: skip,
        sort: {top: -1, createdTime: -1}
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
    if (this.query.keyword)
        query.title = new RegExp(this.query.keyword, 'i')
    var opts = {
        limit: num,
        skip: skip,
        sort: {top: -1, createdTime: -1}
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
    var params = this.request.body.fields // asume title and link required is worked
	var data = {title: params.title, link: params.url}
	var exist = Post.tfindOne(data)
	if (exist) {
		this.flash = {error: "This title already exist"}
		this.redirect('/submit')
	} else {
		yield Post.tcreate(data)
		this.redirect('/submitsuccess')
	}
})

/*
* used by chrome extension
*/
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
IndexRouter.get('/item/:id', function * () {
    var id = this.params.id
    var post = yield Post.tfindById(id)
    yield this.render('item', {
        post: post,
        title: post.title
    })
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
    yield this.render('submit', {error: this.flash.error || ''})
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

/*
*
*/
IndexRouter.get('/test', function * () {
    try {
        var user = yield User.tcreate({name: 'hello', pwd: 'helloo', email: 'hello@some.com'})
        this.body = {message: 'some message'}
    } catch(e) {
        this.body = {message: e.message}
    }
})

/*
*
*/
IndexRouter.get('/sitemap.xml', function * () {
    var posts = yield Post.tfind({hidden: false})
    var urls = posts.map(function (item) {return '/item/' + item._id})
    var xml = yield createSM(urls)
    this.set('Content-Type', 'application/xml')
    this.body = xml
})

/*
*
*/
IndexRouter.get('/preview/:id', function * () {
    var id = this.params.id
    var file = path.join(__dirname, '../tmp/previews/', id + '.html')
    try {
        var exist = yield fs.exists(file)
        var content
        if (exist) {
            content = yield fs.readFile(file, 'utf8')
        } else {
            var p = yield Post.tfindById(id)
            if (p) {
                var result = yield request(p.link)
                content = expandRelative(result.body, p.link)
                yield fs.writeFile(file, content)
            } else {
                content = "<h3>404</h3>"
            }
        }
        this.body = content
    } catch (e) {
        this.body = "<h3>404</h3>"
    }
})


function expandRelative (html, url) {
    html = replace(html, url)
    var $ = cheerio.load(html)
    $('link').each(function () {
        var href = $(this).attr('href')
        $(this).attr('href', _replace(href, url))
    })
    $('script').each(function () {
        var src = $(this).attr('src')
        $(this).attr('src', _replace(src, url))
    })
    $('img').each(function () {
        var src = $(this).attr('src')
        $(this).attr('src', _replace(src, url))
    })
    return $.html()
}

function hostName (link) {
    var o = urlHelper.parse(link)
    var h = o.protocol + '//' + o.hostname
    if(o.port) h += ':' + o.port
    return h
}

function replace (html, url) {
    var reg = /url\("(.+)"\)/g
    var reg2 = /url\('(.+)'\)/g
    html = html.replace(reg, function (match, link) {
        var newL = _replace(link, url)
        return match.replace(link, newL)
    })
    html = html.replace(reg, function (match, link) {
        var newL = _replace(link, url)
        return match.replace(link, newL)
    })
    return html
}

function _replace (origin, url) {
    if (!origin || !url) return origin
    if (origin.indexOf('//') == 0 || origin.indexOf('http') == 0) return origin
    var h = hostName(url)
    if (origin.indexOf('/') == 0)
        return h + origin
    if (origin.indexOf('./') == 0)
        origin = origin.replace('./', '')
    if (!/\/$/.test(url)) url += '/'
    return url + origin
}
