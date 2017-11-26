/**
 * Библиотека шаблона исполнения controller
 */

'use strict'

const _ = require('lodash')

/**
 * @class
 */
class BaseController {
  /**
   * @param {Object} options Настройки
   * @param {Function} options.main Обработчик запроса (основная логика контролера)
   * @param {Function} [options.postProcessing] Обработчик запроса (пост обработка данных)
   * @param {Function} options.log экземпляр лога
   * @param {string} options.name тег лога
   *
   * @constructor
   */
  constructor (options) {
    const { name } = options
    const nameInit = `${name}.Controller`

    _.merge(this, options, { name: nameInit })
  }

  /**
   * Метод запуска выполнения контроллера
   *
   * @param {Object} request Пользовательский запрос
   * @param {Object} response Ответ
   * @param {Function} next Перейти к следующей мидлваре
   *
   * @return {Promise.<object>} -
   */
  run (request, response, next) {
    const that = this
    const { ctx } = request
    const swaggerParams = request.swagger.params
    const parameters = _.mapValues(swaggerParams, 'value')

    const params = {
      parameters,
      request,
      response,
      next
    }

    const {log, name} = that

    log.info(`[${name} Run`, { parameters })

    // Предобработка
    return Promise.resolve(that.preProcessing(ctx, params))
            // запускаем main
            .then((result) => that.main(ctx, params, result))

            // Если в результате выполнения блока main вернулась ошибка
            //  в том числе как объект class Error
            .then((result) => {
              if (result instanceof Error) {
                log.warn(name, `Not throwable Error`, result)

                return Promise.reject(result)
              }

              return result
            })
            // Постобработка
            .then((result) => that.postProcessing(ctx, params, result))
            .then((result) => {
              log.info(`[${name}] End`)
              log.debug(`[${name}] End with result`, { result })

              if (!response.finished) {
                response.hal(result)
              }
            })
            // бросаем все ошибки на мидлвару ошибок
            .catch(next)
  }

  /**
   * Предобработка данных полученых на этапе main
   * @param {Object} ctx Контекст запроса
   * @param {Object} params Параметры запроса
   *
   * @returns {Promise.<Object>} -
   */
  preProcessing (ctx, params) {
    return Promise.resolve(null)
  }

  /**
   * Постобработка данных полученых на этапе main
   * @param {Object} ctx Контекст запроса
   * @param {Object} params Данные запроса
   * @param {*} result Результат выполненния этапа main
   *
   * @returns {Promise.<Object>} -
   */
  postProcessing (ctx, params, result) {
    return result
  }
}

module.exports = BaseController
