'use strict'
var mongoose = require('mongoose')
var config = require('../configs/config.json')

mongoose.connect(config.mongoUrl)

var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function callback () {
    console.log("mongodb is ready!");
})

