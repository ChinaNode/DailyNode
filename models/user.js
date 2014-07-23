var mongoose = require('mongoose')

var UserSchema = mongoose.Schema({
    name: {type: String, unique: true},
    pwd: String,
    email: {type: String, unique: true},
    createdTime: {type: Date, default: Date.now},
    updatedTime: {type: Date, default: Date.now},
    group: {type: Number, default: 0}
})

UserSchema.statics.findOneC = function (query) {
    var that = this
    return function (cb) {
        that.findOne(query, cb)
    }
}

UserSchema.statics.findC = function () {
    var that = this, args = arguments
    return function (cb) {
        args.push(cb)
        that.find.apply(that, args)
    }
}

var User = mongoose.model('User', UserSchema)

module.exports = User