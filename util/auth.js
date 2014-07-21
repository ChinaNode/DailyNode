'use strict'

exports.auth = function * (next) {
    if(this.session.user)
        yield next
    else
        this.redirect('/user/login')
}