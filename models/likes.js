'use strict'
var mongoose = require('mongoose')
var thunkify = require('./thunkify')
var LikeSchema = mongoose.Schema({
    userName: {type: String},
    postId: {type: String}, // objectId
    createdTime: {type: Date, default: Date.now},
})
var Like = mongoose.model('Like', LikeSchema)
thunkify(Like)
module.exports = Like