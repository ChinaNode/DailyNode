var co = require('co')
var assert = require('assert')
var ctx = {};

function foo() {
  assert(this == ctx);
}

co(function *(){
  assert(this == ctx);
  yield foo;
}).call(ctx)