'use strict'

const _ = require('lodash')
const CustomErrors = require('_/lib/errors')
const httpCode = require('http-status-codes')

let addStackTrace = _.noop
const addListError = (errors, data) => {
  errors && _.set(data, 'response.errors', errors)
}

/**
 * Инициализация мидлвары для обработки объектов ошибок в цепочке мидлвар
 * @param {Object} options Объект с настройками
 * @param {Boolean} [options.sendErrorStack] Флаг, надо ли отправлять стек в ответах ошибок
 * @return {Function}
 */
module.exports = (options) => {
  const log = options.log
  const modeView = options.environment !== 'production'

  log.debug('[Module.Middleware.Errors] Start init')

  // Если окружение не продуктовое
  if (modeView) {
    addStackTrace = (err, data) => {
      const errorStack = err.stack

      errorStack && _.set(data, 'response.errorStack', errorStack.split('\n'))
    }
  }

  return function errorMiddleware (error, request, response, next) {
    const responseData = {}
    //  по умолчанию, мета ошибок хранится в errors, но не всегда
    let errors = error.errors
    let code = error.code
    let message = error.message

        //  custom error
    switch (true) {
      case error instanceof CustomErrors.ValidateDataError:
      case error instanceof CustomErrors.RequirePropertyError:
        code = httpCode.NOT_ACCEPTABLE
        message = modeView && message ? message : 'Validate Error'

        break
      case error instanceof CustomErrors.NotFoundError:
        code = httpCode.NOT_FOUND
        message = modeView && message ? message : 'Not found'

        break

      //  ошибки валидации swagger
      //  например, на входящие данные
      case error.code === 'SCHEMA_VALIDATION_FAILED':
        errors = _.concat(error.results.errors, error.results.warnings)
        code = httpCode.NOT_ACCEPTABLE
        message = modeView && message ? message : 'Validate Error'

        break

      //  валидация swagger параметров
      case error.failedValidation:
        errors = error.path
        code = httpCode.NOT_ACCEPTABLE
        message = modeView && message ? message : 'Validate Error'

        break

      default:
        code = modeView && code ? code : httpCode.INTERNAL_SERVER_ERROR
        message = modeView && message ? message : 'Unexpected Error'

        break
    }

    _.set(responseData, 'headers.statusCode', code)
    _.set(responseData, 'response.error', message)

    addStackTrace(error, responseData)
    addListError(errors, responseData)

    return response
            .status(code)
            .json(responseData)
  }
}
