'use strict'

const _ = require('lodash')

const root = process.cwd()
const fixProduct = require(`${root}/fixture/product/product`)

const log = require('_/instance/log')
const Product = require('_/model/product/model')

exports.migrate = async function () {
  const products = await Product.find({}).exec()

  if (_.isEmpty(products)) {
    const products = await Promise.all(fixProduct.map(item => new Product(item).save()))

    log.info('[Migrate.AddListProduct] Add list product count: %s', products.length)

    return null
  }

  log.info('[Migrate.AddListProduct] Skip. Already exist.')

  return null
}

//  todo: implement
exports.rollback = function () {

}
