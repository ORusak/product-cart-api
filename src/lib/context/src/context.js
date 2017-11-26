'use strict'

const uuid = require('uuid')

const smblId = Symbol('id')
const smblCreated = Symbol('created')

class Context {
    /**
     * @constructor
     * @param {object} options -
     */
  constructor (options) {
    this[smblId] = uuid().replace(/-/g, '')
    this[smblCreated] = Date.now()

    Object.assign(this, options)
  }

  /**
   * Возвращает идентификатор контекста запроса
   *
   * @return {string} идентификатор
   */
  get id () {
    return this[smblId]
  }

  /**
   * Возвращает дату создания контекста
   *
   * @return {date} дата
   */
  get created () {
    return this[smblCreated]
  }
}

module.exports = Context
