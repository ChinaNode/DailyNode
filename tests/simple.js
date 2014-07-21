var co = require('co')
var User = require('../models/user')
require('../models/db')


function findOne (query) {
    return function (cb) {
        User.findOne(query, cb)
    }
}



co(function * () {
    var a = yield findOne({name: 'admin', pwd: '123456'})
    console.log(a)
    return a
})()


// User.findOne({name: 'admin', pwd: '123456'}, function (err, result) {
//     console.log(err, result)
// })

