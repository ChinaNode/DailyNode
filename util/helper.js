'use strict'
var crypto = require('crypto')

module.exports = {
    b0: function (num) {
        return num > 9 ? num : '0' + num
    },

    md5: function (str) {
        var hash = crypto.createHash('md5').update(str).digest("hex")
        return hash
    }
}