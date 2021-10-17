'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  devServer: {
    host: '0.0.0.0',
    port: 3010,
    public: 'localhost:3010'
  }
})
