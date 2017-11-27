'use strict'

const _ = require('lodash')

const { InvalidParamsError } = require('_/lib/error')
const Controller = require('_/lib/controller')
const log = require('_/instance/log')

const Cart = require('_/model/cart/model')
const Product = require('_/model/product/model')

const name = 'cart.deleteProduct'

//  на текущий момент у нас только одна корзина
//  но в последствии могут появится много для разных пользователей
const idCart = 0

const controller = new Controller({
  name,
  log,

  //  todo: вынести общий код с add-product
  async preProcessing (ctx, params) {
    //  проверим что продукт существует в системе
    const productId = params.parameters['product_id']
    const products = await Product.find({ id: productId }).exec()

    if (_.isEmpty(products)) {
      throw new InvalidParamsError('Такого продукта нет в системе')
    }

    return _.first(products)
  },

  async main (ctx, params) {
    const productId = params.parameters['product_id']

    //  поищем текущую корзину
    const carts = await Cart.find({ id: idCart }).exec()
    const cart = _.first(carts)

    log.info(`[${name}] Delete product from cart. `, {
      cart: cart.id,
      product: productId
    })

    //  если корзины нет, то и удалять нечего
    if (_.isNil(cart)) {
      log.info(`[${name}] Cart empty. Skip. `, {
        cart: cart.id
      })

      return {}
    }

    //  поищем продукт в корзине
    const index = _.findIndex(cart.products, { id: productId })

    //  если такого продукта в корзине нет, то и удалять нечего
    if (index === -1) {
      log.warn(`[${name}] Product not found in cart. `, {
        cart: cart.id,
        product: productId
      })

      return {}
    } else {
      const count = Number(cart.products[index].count)

      //  что-то пошло не так
      if (_.isNaN(count)) {
        cart.products[index].count = 0
      } else {
        cart.products[index].count -= 1
      }

      if (cart.products[index].count === 0) {
        log.debug(`[${name}] Delete last count product from cart. Remove product. `, {
          cart: cart.id,
          product: productId
        })

        const productsNew = _.remove(cart.products, (item, i) => i !== index)

        cart.products = productsNew
      }
    }

    //  todo: переработать на автоматическое обновление в БД
    _.set(cart, 'updated_at', (new Date()).toISOString())

    await cart.save()

    log.info(`[${name}] Deleted product from cart: `, {
      cart: cart.id,
      product: productId,
      leftCount: _.get(cart, `products[${index}].count`, null)
    })

    return {}
  }
})

module.exports = controller
