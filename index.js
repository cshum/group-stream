var Transform = require('stream').Transform

function defaultKey (val) {
  return val.key || val
}

function identity (val) {
  return val
}

module.exports = function group (toKey, format) {
  if (typeof toKey !== 'function') {
    toKey = defaultKey
  }
  if (typeof format !== 'function') {
    format = identity
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
      value.push(format(data))
      cb()
    },
    flush: function (cb) {
      if (value) this.push({ key: curr, value: value })
      cb()
    }
  })
}
