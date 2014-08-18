'use strict'
var mongoose = require('mongoose')
var thunkify = require('./thunkify')
var CommentSchema = mongoose.Schema({
    userName: {type: String},
    postId: {type: String}, // objectId
    content: {type: String},
    createdTime: {type: Date, default: Date.now},
})
var Comment = mongoose.model('Comment', CommentSchema)
thunkify(Comment)
module.exports = Comment