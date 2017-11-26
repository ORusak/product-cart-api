'use strict'

const Controller = require('_/lib/controller')
const log = require('_/instance/log')

const name = 'product.getList'

const controller = new Controller({
  name,
  log,

  main () {
    return [{}]
  }
})

module.exports = controller
