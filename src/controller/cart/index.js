'use strict'

const addProduct = require('./add-product')
const deleteProduct = require('./delete-product')
const getInfo = require('./get-info')

module.exports = {
  addProduct: addProduct.run.bind(addProduct),
  deleteProduct: deleteProduct.run.bind(deleteProduct),
  getInfo: getInfo.run.bind(getInfo)
}
