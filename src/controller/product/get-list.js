'use strict'

const _ = require('lodash')

const Controller = require('_/lib/controller')
const log = require('_/instance/log')

const Product = require('_/model/product/model')

const name = 'product.getList'

const controller = new Controller({
  name,
  log,

  async main () {
    const products = await Product.find({}).exec()

    log.info(`[${name}] Get product: `, products.length)

    return products.map(item => _.omit(item.toObject(), ['__v', '_id']))
  }
})

module.exports = controller
