'use strict'
var mongoose = require('mongoose')
var pluginLastMod = require('./lastMod')
var thunkify = require('./thunkify')

var UserSchema = mongoose.Schema({
    name: {type: String, unique: true},
    pwd: String,
    email: {type: String, unique: true},
    createdTime: {type: Date, default: Date.now},
    group: {type: Number, default: 1}
})
UserSchema.plugin(pluginLastMod, {index: true})
var User = mongoose.model('User', UserSchema)
//
thunkify(User)

module.exports = User


