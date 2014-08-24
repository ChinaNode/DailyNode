var URL = "http://www.tuicool.com/topics/11060028?st=0&lang=0&pn=0"
var request = require('request')
var cheerio = require('cheerio')

exports.crawl = getPost

function getPost (cbk) {
	request(URL, function (err, response, body) {
		if (err) return cbk(null, [])
		$ = cheerio.load(body)
		var $post = $('.list_article .single_fake')
		var posts = extractPost($post)
		cbk(null, posts)
	})
}

function extractPost ($dom) {
	var ps = []
	$dom.each(function () {
		var $this = $(this)
		var post = {
			title: $this.find('.single .article_title a').text(),
			link: "http://www.tuicool.com" + $this.find('.single .article_title a').attr('href'),
			source: $this.find('.meta-tip .cut').text().replace(/\n|\t/g, ''),
			summary: $this.find('.single .article_cut').text().replace(/\n|\t/g, '')
		}
		ps.push(post)
	})
	return ps
}


exports.crawl2 = function getPost (url, cbk) {
	request(url, function (err, response, body) {
		if (err) return cbk(null, [])
		$ = cheerio.load(body)
		var $post = $('.list_article .single_fake')
		var posts = extractPost($post)
		cbk(null, posts)
	})
}


