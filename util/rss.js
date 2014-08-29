var RSS = require('rss')
var url = 'http://news.rednode.cn'

exports.genRss = function (posts) {
	var feed = new RSS({
		title: "DailyNode -- The most timely and complete Node aggregator",
		description: "A hub of Node things: news, blog, video, module, product",
		feed_url: "http://news.rednode.cn/feed",
		site_url: url,
		image_url: "http://yuan.rednode.cn/assets/img/node44.png",
		author: "Pana W",
		copyright: "RedNode",
		pubDate: new Date(),
		ttl: 60,
		language: 'en',
		categories: ['Node', 'Tech']
	})
	posts.forEach(function (post) {
		var link = post.description ? url + '/item/' + post._id : post.link
		feed.item({
			title: post.title,
			description: post.description,
			url: link,
			author: post.author,
			date: post.pubDate,
			categories: [post.category]
		})
	})
	return feed.xml('\t')
}
