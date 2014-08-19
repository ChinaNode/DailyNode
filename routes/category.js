'use strict'
var Router = require('koa-router')
var CategoryRouter = new Router()
var Category = require('../models/category')
var h = require('../util/helper')
var adminAuth = require('../util/auth').adminAuth
module.exports = CategoryRouter

/**
*   index
*/
CategoryRouter.get('/', adminAuth, function * () {
    var cates = yield Category.tfind()
    yield this.render('category', {layout: 'BL', cates: cates})
})

/*
*
*/
CategoryRouter.get('/new', adminAuth, function * () {
    yield this.render('category_new', {layout: 'BL'})
})

/*
*
*/
CategoryRouter.post('/', adminAuth, function * () {
    var params = this.request.body.fields
    yield Category.tcreate({name: params.name})
    this.redirect('/category')
})

/*
*   delete
*/
CategoryRouter.delete('/:id', adminAuth, function * () {
    yield Category.tremove({_id: this.params.id})
    this.redirect('/category')
})
