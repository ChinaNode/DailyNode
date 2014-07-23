var Post = require('../models/post')
var fetchRSS = require('./rssCrawler').fetchRSS
var RSS = require('../configs/rss.json').RSS
var async = require('async')
var debug = require('debug')('rssSpider')
var db = require('../models/db')  // connect db

function createPost (post, cbk) {

    var p = new Post({
        title: post.title,
        description: post.description,
        summary: post.summary,
        date: post.date,
        pubDate: post.pubDate,
        link: post.link,
        author: post.author
    })

    p.save(function (err, result) {
        if(err)
            debug(err)   //TODO if same tile post already exist here will be error

        cbk()
    })
}

var intervalHandle

// start RSS crawl
exports.crawl = function (interval) {
    interval = interval || 30*60000

    // do the crawl job
    function doc () {
        var now = new Date()
        debug('Start ' + now)
        async.eachSeries(RSS, function (item, cbk) {
            debug('Start fetch ' + item.name)
            fetchRSS(item.url, function (err, posts) {
                debug(item.name + ' fetch ended!')
                if (err) {
                    debug(err)
                    cbk()
                } else {
                    async.each(posts, createPost, cbk)
                }
            })
        }, function (err, result) {
            debug(now + ' fetch ended')
        })
    }

    // setInterval
    intervalHandle = setInterval(doc, interval)
    
    // start instantly
    doc()
}

// stop crawl job
exports.stopCrawl = function () {
    clearInterval(intervalHandle)
}
