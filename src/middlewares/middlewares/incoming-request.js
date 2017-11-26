/**
 * Превичная обработка входящего запроса:
 * - логирование
 * - создание GUID запроса
 * - формирование первичного контекста запроса
 */

'use strict'

const _ = require('lodash')

const { RequestContext } = require('_/lib/context')

module.exports = function incomingRequest (options) {
  const log = options.log

  /**
    * Инициализация контекста для входящего запроса
    * @returns {Function}
  */
  return function incomingRequest (request, response, next) {
    const ctx = new RequestContext(request)

    // eslint-disable-next-line no-param-reassign
    request.ctx = ctx

    // Заголовок для ответа
    response.set('x-request-id', ctx.id)

    response.on('finish', () => {
      const responseMeta = _.pick(response, [
        'statusCode',
        'statusMessage',
        '_hasBody',
        '_headers'
      ])
      const time = Date.now() - ctx.created

      log.debug('[Middleware.IncomingRequest] Finish', `Request ${request.method}:${request.url} finished in ${time}ms`, responseMeta)
    })

    next()
  }
}
