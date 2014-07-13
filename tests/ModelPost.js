var Post = require('../models/post')
require('../models/db')



Post.find({}, function (err, docs) {
    console.log(err)
    console.log(docs)
})



/*Post.create({
    title: 'first news', 
    description: 'this is the first news blog'
}, function (err, result) {
    console.log(err, result)
})*/