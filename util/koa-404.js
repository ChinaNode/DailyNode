module.exports = function methodOverride(key) {
  key = key || '_method'

  return function *pageNotFound(next){
    yield next;

    if (404 != this.status) return;
    this.status = 404;

    switch (this.accepts('html', 'json')) {
      case 'html':
        this.type = 'html';
        // this.body = '<p>Page Not Found</p>';
        // console.log('hello')
        yield this.render('404', {layout: 'lr'});
        break;
      case 'json':
        this.body = {
          message: 'Page Not Found'
        };
        break
      default:
        this.type = 'text';
        this.body = 'Page Not Found';
    }
  }
}