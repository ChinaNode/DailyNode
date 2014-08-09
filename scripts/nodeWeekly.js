var request = require('request')
var cheerio = require('cheerio')
var URL = 'http://nodeweekly.com/issues'
var fs = require('fs')
var async = require('async')
var FILE = __dirname + '/nodeWeeklyIssues.json'

exports.crawl = crawl

// crawl(function (err, posts) {
//     if(err) console.log(err)

//     console.log(posts)
// })

function crawl (callback) {
    var issues, posts = []
    
    function old (cbk) {
        fs.readFile(FILE, cbk)
    }

    function getIssueList(content, cbk) {
        issues = JSON.parse(content)
        getIssues(cbk)
    }

    function getPost (list, cbk) {
        var links = issues.map(function (item) {return item.link})
        var needCrawl = []
        for(var i in list) {
            var t = list[i]
            if(links.indexOf(t.link) == -1) {
                issues.push(t)
                needCrawl.push(t)
            }
        }
        async.eachSeries(needCrawl, function (item, cbki) {
            getIssuePost(item, function (err, result) {
                if(err) return cbki()
                posts = posts.concat(result)
                cbki()
            })
        }, cbk)
    }

    function writeBack (cbk) {
        fs.writeFile(FILE, JSON.stringify(issues, null, '\t'), cbk)
    }

    async.waterfall([old, getIssueList, getPost, writeBack], function (err) {
        callback(null, posts)
    })
}

function getIssues (cbk) {
    request(URL, function (err, res, body) {
        if(err) return cbk(err)

        var $ = cheerio.load(body)
        var issues = []
        $('.issues li.issue').each(function () {
            var $this = $(this)
            var issue = {
                title: $this.find('a').text(),
                link: 'http://nodeweekly.com/' + $this.find('a').attr('href'),
            }
            $this.find('a').remove()
            $this.find('div').remove()
            issue.week = $this.text().replace(' — ', '')
            issues.push(issue)
        })
        cbk(null, issues)
    })
}

function getIssuePost (item, cbk) {
    // console.log(item.link)
    request(item.link, function (err, res, body) {
        if(err) return cbk(err)

        var $ = cheerio.load(body)
        var posts = []
        if($('.container-padding').length == 0) {
            $('.issue-html>table table.noarchive').remove()
            var $container = $('.issue-html>table table.container tr:nth-child(2)')
            var $dom = $container.find('table:nth-child(even)')
            $dom.each(function () {
                var $d = $(this).find('div')
                posts.push({
                    title: $d.first().find('a').text(),
                    link: $d.first().find('a').attr('href'),
                    summary: $d.first().next().text()
                })
            })
            var $brief = $container.find('ul').last().find('li')
            $brief.each(function () {
                var $this = $(this)
                posts.push({
                    title: $this.find('a').text(),
                    link: $this.find('a').attr('href'),
                    source: cleanTxt($this.find('span').last().text())
                })
            })
        } else {
            var $dom = $('.container-padding > table table')
            $dom.each(function () {
                var $this = $(this)
                var item = {
                    title: $this.find('tr').first().find('a').text(),
                    link: $this.find('tr').first().find('a').attr('href'),
                    summary: cleanTxt($this.find('tr').first().find('span').text())
                }
                item.source = cleanTxt($this.find('tr').last().text())
                posts.push(item)
            })
        }
        // 
        posts.forEach(function (t) {
            t.pubDate = item.week
        })
        cbk(null, posts)
    })
}

function cleanTxt (item) {
    item = item || ''
    return item.replace(/\n/g, '').trim()
}
