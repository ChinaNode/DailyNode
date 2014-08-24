var URL = "http://venturebeat.com/tag/node-js/"
var request = require('request')
var cheerio = require('cheerio')

exports.crawl = getPost

function getPost (cbk) {
	request(URL, function (err, response, body) {
		if (err) return cbk(null, [])
		$ = cheerio.load(body)
		var $post = $('#content article .entry-wrapper')
		var posts = extractPost($post)
		cbk(null, posts)
	})
}

function extractPost ($dom) {
	var ps = []
	$dom.each(function () {
		var $this = $(this)
		var post = {
			title: $this.find('.entry-title a').text(),
			link: $this.find('.entry-title a').attr('href'),
			summary: $this.find('.entry-summary').text(),
			source: 'Venturebeat',
			pubDate: $this.find('.entry-meta .the-time').text(),
			author: $this.find('.entry-meta .the-author a').text(),
			recommend: true
		}
		ps.push(post)
	})
	return ps
}
