var request = require('request')
var cheerio = require('cheerio')
var async = require('async')
var URL = 'http://blog.nodejs.org'
var fs = require('fs')

exports.crawl = function (cbk) {
    getOnePage(URL, cbk)
}

/*
var DATA = [];
(function get (url) {
    console.log("Getting " + url)
    getOnePage(url, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            DATA = DATA.concat(result.posts)
            if (result.next) {
                get(URL + result.next)
            } else {
                console.log("Total have " + DATA.length + ' blogs')
                fs.writeFileSync('./NodeOfficialBlog.json', JSON.stringify(DATA))
            }
        }
    })
})(URL)
*/

/*
*   getOnePage blog
*/
function getOnePage (url, cbk) {
    request.get(url, function (err, res, body) {
        if(err)
            return cbk(err)

        $ = cheerio.load(body)
        var next = $('#column1 > .next a')
        var feeds = $('.post-in-feed')
        var posts = feeds.map(extractPost)
        var data = []
        for (var i = 0; i < posts.length; i++) {
            data.push(posts[i])
        }
        var result = {
            posts: data,
            next: next.attr('href')
        }
        cbk(null, result)
    })
}


/*
*   extract post data from one html element
*/
function extractPost (index, element) {
    var $this = $(this)
    $this.find('.meta a').remove()
    var post = {
        title: $this.find('h1 a').text(),
        link: URL + $this.find('h1 a').attr('href'),
        pubDate: $this.find('.meta').text().slice(0, 32),
        source: 'nodejs.org'
    }
    $this.find('h1').remove()
    $this.find('.meta').remove()
    post.desription = $this.html()
    return post
}


