var URL = "https://nodesource.com/blog"
var request = require('request')
var cheerio = require('cheerio')

exports.crawl = getPost

function getPost (cbk) {
	request(URL, function (err, response, body) {
		if (err) return cbk(null, [])
		$ = cheerio.load(body)
		var $post = $('.post-index article')
		var posts = extractPost($post)
		cbk(null, posts)
	})
}

function extractPost ($dom) {
	var ps = []
	$dom.each(function () {
		var $this = $(this)
		var meta = $this.find('.post-meta .byline').text()
		var author = meta.split(' on ')[0].replace('by', '')
		var post = {
			title: $this.find('h1 a').text(),
			link: "https://nodesource.com" + $this.find('h1 a').attr('href'),
			source: 'NodeSource',
			author: author,
			recommend: true
		}
		$this.find('h1').remove()
		$this.find('.post-meta').remove()
		post.description = $this.html()
		ps.push(post)
	})
	return ps
}
