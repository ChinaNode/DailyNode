var sm = require('sitemap')
var thunkify = require('thunkify')

function createSM (urls, cbk) {
    urls = urls.map(function(item){
        return {
            url: item,
            changefreq: 'weekly',
            priority: 0.5
        }
    })
    var sitemap = sm.createSitemap({
        hostname: 'http://news.rednode.cn',
        cacheTime: 600000,
        urls: urls
    })
    sitemap.toXML(function (xml) {cbk(null, xml)})
}

module.exports = thunkify(createSM)