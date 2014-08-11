module.exports = function methodOverride(key) {
  key = key || '_method'

  return function *methodOverride(next) {
    var request = this.request
    var params = request.body.fields || {}
    var method = this.query[key] || params[key]
    // this.request.body
    if(method)
      request.method = method.toUpperCase()
    yield *next
  }
}