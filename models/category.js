'use strict'
var mongoose = require('mongoose')
var pluginLastMod = require('./lastMod')
var thunkify = require('./thunkify')

var CategorySchema = mongoose.Schema({
    name: {type: String, unique: true},
    createdTime: {type: Date, default: Date.now}
})
CategorySchema.plugin(pluginLastMod, {index: true})
var Category = mongoose.model('Category', CategorySchema)
//
thunkify(Category)

module.exports = Category


