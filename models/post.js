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
    like: {type: Number, default: 0},
    source: String,
    category: String,
    hidden: {type: Boolean, default: false},
    publish: {type: Boolean, default: false},
    submit: {type: Boolean, default: false},
    recommend: {type: Boolean, default: false}
})    // comments, favs
PostSchema.plugin(pluginLastMod, {index: true})

var Post = mongoose.model('Post', PostSchema)
thunkify(Post)

module.exports = Post