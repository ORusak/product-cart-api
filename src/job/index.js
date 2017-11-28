'use strict'

const path = require('path')

const factoryCron = require('./cron-factory')

const listOptionsJob = require('require-all')({
  dirname: __dirname,
  resolve (options) {

    return factoryCron(options)
  },
  filter: /^options.js$/,
  map (name, pathFile) {

    return path.basename(path.dirname(pathFile))
  }
})

console.log(listOptionsJob)
