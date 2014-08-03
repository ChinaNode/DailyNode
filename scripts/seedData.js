'use strict'
var db = require('../models/db')
var User = require('../models/user')
var Post = require('../models/post')
var h = require('../util/helper')
var async = require('async')

function initUser (callback) {
    var user = new User({name: 'admin', pwd: h.md5('adminpana'), email: 'admin@rednode.cn', group: 0})
    user.save(function (err, result) {
        callback()
    })
}

function officialSave (callback) {
    var officialBlog = require('./NodeOfficialBlog.json')
    async.eachSeries(officialBlog, function (item, cbk) {
        console.log('\nSaveing ' + item.title)
        new Post({
            title: item.title,
            link: item.link,
            description: item.body,
            source: 'nodejs.org',
            pubDate: new Date(item.meta.slice(0, 32))
        }).save(function (err){
            cbk()
        })
    }, callback)
}

function SLsave (callback) {
    var SLBlog = require('./SLOfficialBlog.json')
    async.eachSeries(SLBlog, function (item, cbk) {
        console.log('\nSaveing ' + item.title)
        new Post({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            author: item.author.replace('by ', ''),
            source: 'StrongLoop',
            description: item.body
        }).save(function () {
            cbk()
        })
    }, callback)
}

console.log('start importing data\n')
async.series([initUser, officialSave, SLsave], function () {
    console.log('All data has been inited')
})