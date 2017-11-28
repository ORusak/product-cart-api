'use strict'

const _ = require('lodash')
const config = require('config')

const handler = require('./handler')

const name = 'clearCart'
const optionsConfig = config.get('jobCron.clearCart')
const options = {
  onTick: handler,
  name
}

module.exports = _.defaults(options, optionsConfig)
