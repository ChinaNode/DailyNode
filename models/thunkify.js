'use strict'
var thunkify = require('thunkify')

module.exports = function (model) {
    var methods = ['remove', 'find', 'findById', 'findOne', 'count', 'create', 'update']
    for (var i in methods){
        var m = methods[i]
        model['t'+m] = thunkify(model[m])
    }
}