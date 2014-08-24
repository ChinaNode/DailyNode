var url = 'http://www.tuicool.com/topics/11060028?st=0&lang=0&pn='


var crawl = require('../scripts/tuicool').crawl2
var createPost = require('../scripts/spider').createPost
var async = require('async')


var id = process.argv[2] || 0

console.log(id)
crawl(url+id, function (err, posts) {
	console.log(posts.length)
	async.eachSeries(posts, createPost, function () {
		console.log('finish')
	})
})
