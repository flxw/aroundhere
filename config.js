module.exports = {
  'port' : ':8080',
  'debug': (function() { return process.env.NODE_ENV !== 'production' })(),
  'db' : {
    'url' : (function() {
              if (this.debug) {
                return 'brew '
              } else {
                return 'mongodb://localhost/test'
              }
            })()
  }
}