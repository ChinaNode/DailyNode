var request = require('request')
var FeedParser = require('feedParser')
var iconv = require('iconv-lite')
var cheerio = require('cheerio')


exports.fetchRSS = fetchRSS


function fetchRSS (url, callback) {
    var posts

    var req = request(url, {timeout: 10000, pool: false})
    req.setMaxListeners(50)
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
    req.setHeader('accept', 'text/html,application/xhtml+xml')

    var feedparser = new FeedParser()

    req.on('error', callback)
    req.on('response', function (res) {
        var stream = this
        posts = []
        if (res.statusCode !== 200) {
            return this.emit('error', new Error('Bad status code'))
        } 
        stream.pipe(feedparser)
    })

    feedparser.on('error', callback)
    feedparser.on('end', function (err) {
        if (err) {
            return callback(err)
        }
        callback(null, posts)
    })
    feedparser.on('readable', function () {
        var post
        while (post = this.read()) {
            posts.push(post)
        }
    })


}



function errStack (err) {
    if (err) {
        console.error(err.stack)
    }
}