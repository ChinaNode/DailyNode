'use strict'

exports.auth = function * (next) {
    if(this.session.user)
        yield next
    else
        this.redirect('/login')
}


exports.adminAuth = function * (next) {
    if(this.session.user && this.session.user.group == 0)
        yield next
    else
        this.redirect('/user/login')
}



exports.authJson = function * (next) {
    if(this.session.user)
        yield next
    else
        this.body = {code: 1, message: 'Need Login'}
}


// rewrite this to middleware
