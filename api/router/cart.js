'use strict'

const { 
    getInfo,
    deleteProduct,
    addProduct
} = require('_/controller/cart')

module.exports = {
    getInfo: getInfo.run.bind(getInfo),
    deleteProduct: deleteProduct.run.bind(deleteProduct),
    addProduct: addProduct.run.bind(addProduct)
}
