'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOT_API: '"http://127.0.0.1:3009"', // when using localhost, firefox does not send Origin header
  devServer: {
    host: '0.0.0.0',
    port: 3010,
    public: 'localhost:3010'
  }
})
