var URL = 'http://strongloop.com/strongblog/'
var request = require('request')
var cheerio = require('cheerio')
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
                get(result.next)
            } else {
                console.log("Total have " + DATA.length + ' blogs')
                fs.writeFileSync('./SLOfficialBlog.json', JSON.stringify(DATA, null, '\t'))
            }
        }
    })
})(URL)*/


////////
function getOnePage (url, cbk) {
    request(url, function (err, response, body) {
        if(err)
            return cbk(err)

        $ = cheerio.load(body)
        var posts = $('.content .post .entry-content')
        var pages = $('.pagination a')
        var next = undefined
        pages.each(function (index, ele) {
            var $this = $(this)
            if($this.text() == '›')
                next = $this.attr('href')
        })
        cbk(null, {
            posts: extractBlogs(posts),
            next: next
        })
    })
}


//////////
function extractBlogs (obj) {
    var ps = []
    obj.each(function () {
        var $this = $(this)
        var result = {
            title: $this.find('.post-title a').text(),
            link: $this.find('.post-title a').attr('href'),
            pubDate: $this.find('.post-meta-infos .date-container').text(),
            author: $this.find('.post-meta-infos .blog-author').text().replace('by', ''),
            source: 'StrongLoop'
        }
        $this.find('.post-title').remove()
        $this.find('.post-meta-infos').remove()
        $this.find('.addtoany_share_save_container').remove()
        $this.find('.post_delimiter').remove()
        result.description = $this.html()  // here is not the complete blog
        ps.push(result)
    })
    return ps
}