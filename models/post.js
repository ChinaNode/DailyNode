var mongoose = require('mongoose')

var PostSchema = mongoose.Schema({
    title: {type: String, unique: true},
    description: String,
    summary: String,
    date: Date,
    pubDate: Date,
    link: String,
    author: String,
    hidden: {type: Boolean, default: false}
})

// comments, favs, hidden

var Post = mongoose.model('Post', PostSchema)

module.exports = Post