'use strict'
var log4js = require('log4js')
var path = require('path')

log4js.configure({
    appenders: [
        { 
            type: 'file',
            filename: path.join(__dirname, '..', 'log/error.log'),
            category: 'error'
        }, { 
            type: 'file',
            filename: path.join(__dirname, '..', 'log/info.log'),
            category: 'info'
        }
    ]
})
var errLogger = log4js.getLogger('error')
errLogger.setLevel('ERROR')
exports.errLogger = errLogger
var infoLogger = log4js.getLogger('info')
infoLogger.setLevel('INFO')
exports.infoLogger = infoLogger
