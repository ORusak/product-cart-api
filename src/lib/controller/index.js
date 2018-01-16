/**
 * Библиотека шаблона исполнения controller
 */

'use strict'

const _ = require('lodash')

const DEFAULT_STATUS = 200
const DEFAULT_CONTENT_TYPE = 'application/json'

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
  async run (request, response, next) {
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

    log.info(`[${name}] Run`, { parameters })

    try {
      // Предобработка
      const preResult = await that.preProcessing(ctx, params)
              // запускаем main
      const result = await that.main(ctx, params, preResult)

      // Если в результате выполнения блока main вернулась ошибка
      //  в том числе как объект class Error
      if (result instanceof Error) {
        log.warn(name, `Not throwable Error`, result)

        throw result
      }

      const postResult = await that.postProcessing(ctx, params, result)

      log.info(`[${name}] End`)
      log.debug(`[${name}] End with result`, { postResult })

      if (!response.finished) {
        response
          .status(DEFAULT_STATUS)
          .type(DEFAULT_CONTENT_TYPE)
          .json(postResult)
      }
    } catch (error) {
      // бросаем все ошибки на middleware ошибок
      next(error)
    }
  }

  /**
   * Предобработка данных полученных на этапе main
   * @param {Object} ctx Контекст запроса
   * @param {Object} params Параметры запроса
   *
   * @returns {Promise.<Object>} -
   */
  preProcessing (ctx, params) {
    return null
  }

  /**
   * Постобработка данных полученых на этапе main
   * @param {Object} ctx Контекст запроса
   * @param {Object} params Данные запроса
   * @param {*} result Результат выполнения этапа main
   *
   * @returns {Promise.<Object>} -
   */
  postProcessing (ctx, params, result) {
    return result
  }
}

module.exports = BaseController
