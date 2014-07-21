var db = require('../models/db')
var User = require('../models/user')

var user = new User({name: 'admin', pwd: '123456', email: 'admin@rednode.cn'})
user.save(function (err, result) {
    console.log(err, result)
})
