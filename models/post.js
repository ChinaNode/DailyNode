'use strict'
var mongoose = require('mongoose')
var pluginLastMod = require('./lastMod')
var thunkify = require('./thunkify')

var PostSchema = mongoose.Schema({
    title: {type: String, unique: true},   // TODO post tile is unique, this may be a problem
    description: String,
    summary: String,
    date: Date,
    pubDate: Date,
    link: String,
    author: String,
    createdTime: {type: Date, default: Date.now},
    hidden: {type: Boolean, default: false},
    publish: {type: Boolean, default: false}
})    // comments, favs
PostSchema.plugin(pluginLastMod, {index: true})

// TODO use a elegant thunk way 
/*
PostSchema.statics.findC = function () {
    var that = this, args = Array.prototype.slice.call(arguments)
    return function (cb) {
        args.push(cb)
        that.find.apply(that, args)
    }
}
*/
var Post = mongoose.model('Post', PostSchema)
thunkify(Post)

module.exports = Post