'use strict'

const _ = require('lodash')

const { InvalidParamsError } = require('_/lib/error')
const Controller = require('_/lib/controller')
const log = require('_/instance/log')

const Cart = require('_/model/cart/model')
const Product = require('_/model/product/model')

//  на текущий момент у нас только одна корзина
//  но в последствии могут появится много для разных пользователей
const idCart = 0

const name = 'cart.addProduct'

const controller = new Controller({
  name,
  log,

  async preProcessing (ctx, params) {
    //  проверим что продукт существует в системе
    const { payload } = params.parameters
    const productId = payload['product_id']
    const products = await Product.find({ id: productId }).exec()

    if (_.isEmpty(products)) {
      throw new InvalidParamsError('Такого продукта нет в системе')
    }

    return _.first(products)
  },

  async main (ctx, params) {
    const { payload } = params.parameters
    const productId = payload['product_id']
    const quantity = payload['quantity']

    const carts = await Cart.find({ id: idCart }).exec()
    const cart = _.first(carts) || new Cart({
      products: [],
      id: idCart
    })

    const index = _.findIndex(cart.products, { id: productId })

    if (index === -1) {
      cart.products.push({
        id: productId,
        count: quantity
      })
    } else {
      const count = Number(cart.products[index].count)

      //  что-то пошло не так
      if (_.isNaN(count)) {
        cart.products[index].count = 0
      }

      cart.products[index].count += quantity
    }

    //  todo: переработать на автоматическое обновление в БД
    _.set(cart, 'updated_at', (new Date()).toISOString())

    await cart.save()

    log.info(`[${name}] Add product to cart: `, {
      cart: cart.id,
      product: productId,
      quantity
    })

    return {}
  }
})

module.exports = controller
