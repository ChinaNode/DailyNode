var fetchRSS = require('../scripts/rssCrawler').fetchRSS


var url = 'http://blog.nodejitsu.com/rss/'
fetchRSS(url, function (err, posts) {
    if(err)
        console.log(err)
    console.log(posts.length);
    console.log(Object.keys(posts[0]))
})