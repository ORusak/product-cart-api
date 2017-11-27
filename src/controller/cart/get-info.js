'use strict'

const _ = require('lodash')

const Controller = require('_/lib/controller')
const log = require('_/instance/log')

const Cart = require('_/model/cart/model')
const Product = require('_/model/product/model')

const name = 'cart.getInfo'

//  на текущий момент у нас только одна корзина
//  но в последствии могут появится много для разных пользователей
const idCart = 0

const controller = new Controller({
  name,
  log,

  async main (ctx) {
    //  поищем текущую корзину
    const carts = await Cart.find({ id: idCart }).exec()
    const cart = _.first(carts)

    log.info(`[${name}] Get info cart. `, {
      cart: cart.id
    })

    //  если корзины нет, то и возвращать нечего
    if (_.isNil(cart)) {
      log.info(`[${name}] Cart empty. Skip. `, {
        cart: cart.id
      })

      return {}
    }

    const cartInfoInit = {
      'total_sum': 0,
      'products_count': 0,
      'products': []
    }
    const cartInfo = _.reduce(cart.products, async (result, item) => {
      const resultInit = await result
      const { count, id } = item
      const products = await Product.find({ id })
      const { price } = _.first(products)

      const sum = price * count

      resultInit.products.push({
        id,
        quantity: count,
        sum
      })

      resultInit['total_sum'] += sum
      resultInit['products_count'] += count

      return resultInit
    }, cartInfoInit)

    log.info(`[${name}] Got info cart: `, {
      cart: cart.id,
      cartInfo
    })

    return cartInfo
  }
})

module.exports = controller
