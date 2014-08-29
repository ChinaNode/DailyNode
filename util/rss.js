var RSS = require('rss')

exports.genRss = function (posts) {
	var feed = new RSS({
		title: "DailyNode -- The most timely and complete Node aggregator",
		description: "A hub of Node things: news, blog, video, module, product",
		feed_url: "http://news.rednode.cn/feed",
		site_url: "http://news.rednode.cn",
		image_url: "http://yuan.rednode.cn/assets/img/node44.png",
		author: "Pana W",
		copyright: "RedNode",
		pubDate: new Date(),
		ttl: 60,
		language: 'en',
		categories: ['Node', 'Tech']
	})
	posts.forEach(function (post) {
		feed.item({
			title: post.title,
			description: post.description,
			url: post.link,
			author: post.author,
			date: post.pubDate,
			categories: [post.category]
		})
	})
	return feed.xml('\t')
}
