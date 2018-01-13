'use strict'

const _ = require('lodash')
const sinon = require('sinon')
const test = require('ava')

//  mock require
const Cart = require('_/model/cart/model')

test.beforeEach(t => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach(t => {
  t.context.sandbox.restore()
  Reflect.deleteProperty(t.context, 'sandbox')
})

/**
 * Основные варианты проверки:
 *   - отстуствие обязательных параметров
 *   - существование или создание новой корзины
 *   - корректность атрибутов при сохранении в БД
 */

test('[add-product] add product 1 quantity in new cart', async t => {
  //  stub require
  t.context.sandbox.stub(Cart, 'find').callsFake(cond => ({
    exec () {
      return Promise.resolve([])
    }
  }))

  //  для получения данных, которые должны уйти на сохранение в БД
  //  используем замыкание, так как прямого доступа нет
  let data = null

  t.context.sandbox.stub(Cart.prototype, 'save').callsFake(function () {
    data = this
    
    return Promise.resolve(null)
  })

  const controller = require('./add-product')
  const ctx = {}
  const productId = 1
  const quantity = 1
  const params = {
    parameters: {
      payload: {
        'product_id': productId,
        quantity
      }
    }
  }
  const result = await controller.main(ctx, params)

  t.true(_.isEmpty(result))
  t.true(Array.isArray(data.products))
  //  отбрасываем свойства mongoose
  //  возможно нужно отбрасывать по какому-то признаку, так как сейчас
  //  нельзя понять не отбросились ли ошибчоные сойства с данными
  t.deepEqual(_.pick(_.first(data.products), ['id', 'count']), {
    id: productId,
    count: quantity
  })

  return null
})
