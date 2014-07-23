var fetchRSS = require('../scripts/rssCrawler').fetchRSS


var url = 'http://blog.nodejitsu.com/rss/'
// var url = 'http://nodeweekly.com/rss'
fetchRSS(url, function (err, posts) {
    if(err)
        console.log(err)
    console.log(posts.length);
    var one = posts[0]
    // console.log(JSON.stringify(one, null, '\t'))
    console.log(Object.keys(one))
})