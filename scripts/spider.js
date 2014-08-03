var Post = require('../models/post')
var fetchRSS = require('./rssCrawler').fetchRSS
var RSS = require('../configs/rss.json').RSS
var async = require('async')
var db = require('../models/db')  // connect db
var logger = require('../util/logger').infoLogger

//
function createPost (post, cbk) {
    Post.findOne({title: post.title}, function (err, data) {
        if(err || data) {
            cbk()
        } else {
            new Post(post).save(function (err, result) {
                cbk()
            })
        }
    })
}

// do the crawl job
function crawlRSS (callback) {
    var now = new Date()
    logger.info('Start ' + now)
    async.eachSeries(RSS, function (item, cbk) {
        logger.info('Start fetch ' + item.name)
        fetchRSS(item.url, function (err, posts) {
            logger.info(item.name + ' fetch ended!')
            if (err) {
                logger.info(err)
                cbk()
            } else {
                async.eachSeries(posts, function (p, cbki) {
                    var post = {
                        title: p.title,
                        description: p.description,
                        summary: p.summary,
                        date: p.date,
                        pubDate: p.pubDate,
                        link: p.link,
                        author: p.author
                    }
                    createPost(p, cbki)
                }, cbk)
            }
        })
    }, function (err, result) {
        logger.info(now + ' fetch ended')
        callback()
    })
}

function crawlNodejs (callback) {
    var crawl = require('./nodejsBlog').crawl
    crawl(function (err, result) {
        async.eachSeries(result.posts, createPost, function () {
            callback()
        })
    })
}

function crawlSL (callback) {
    var crawl = require('./strongLoopBlog.js').crawl
    crawl(function (err, result) {
        async.eachSeries(result.posts, createPost, function () {
            callback()
        })
    })
}

function crawl () {
    async.series([crawlRSS, crawlNodejs, crawlSL], function () {
        logger.info('End once \n\n')
    })
}

// start RSS crawl
exports.start = function (interval) {
    interval = interval || 30*60000
    // setInterval
    intervalHandle = setInterval(crawl, interval)
    // start instantly
    crawl()
}