'use strict'
var b0 = require('./helper').b0

module.exports = {
    formatDate: function (item) {
        if (item) {
            var d = new Date(item)
            var date = d.getFullYear() + '-' + b0((d.getMonth() + 1)) + '-' + b0(d.getDate())
            return date
        } else {
            return 'N/A'
        }
    },
    formatDateTime: function (item) {
        if (item) {
            var d = new Date(item)
            var date = d.getFullYear() + '-' + b0((d.getMonth() + 1)) + '-' + b0(d.getDate())
            var time = b0(d.getHours()) + ':' + b0(d.getMinutes()) + ':' + b0(d.getSeconds())
            return date + ' ' + time
        } else {
            return 'N/A'
        }
    },

    hn: function (item) {
        return item ? item : 'N/A'
    },

    cateClass: function (item) {
        item = item || ''
        var className
        var mapper = {
            'Code': 'listing-info',
            'News': 'listing-primary',
            'NPM': 'listing-warning',
            'Star': 'listing-danger',
			'Cool': 'listing-ppurple',
			'Site': 'listing-pgreen',
			'Github': 'listing-pblue',
			'Tool': 'listing-pyellow'
        }
        className = mapper[item] || 'listing-success'
        return className
    }
}

/*
    listing-danger
    listing-success
    listing-default
    listing-primary
    listing-info
    listing-warning
	listing-pblue
	listing-ppurple
	listing-pgreen
	listing-pred
	listing-porange
	listing-pyellow


*/
