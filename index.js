var Transform = require('stream').Transform

function defaultKey (val) {
  return val.key || val
}

module.exports = function group (toKey) {
  if (typeof toKey !== 'function') {
    toKey = defaultKey
  }
  var curr, value
  return new Transform({
    objectMode: true,
    transform: function (data, enc, cb) {
      var next = toKey(data)
      if (curr !== next) {
        if (value) this.push({ key: curr, value: value })
        value = []
        curr = next
      }
      value.push(data)
      cb()
    },
    flush: function (cb) {
      if (value) this.push({ key: curr, value: value })
      cb()
    }
  })
}
