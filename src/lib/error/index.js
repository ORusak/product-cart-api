/**
 * Перечень пользовательских ошибок
 */

'use strict'

//  todo: Добавить коды ошибок

/**
 * @class
 * Не верный тип свойства
 */
class InvalidPropertyError extends Error {
  constructor (...arg) {
    super(arg)
  }
}
/**
 * @class
 * Объект не найден
 */
class NotFoundError extends Error {
  constructor (...arg) {
    super(arg)
  }
}
/**
 * @class
 * Обязательное свойство
 */
class RequirePropertyError extends Error {
  constructor (...arg) {
    super(arg)
  }
}
/**
 * @class
 * Превышено время ожидания
 */
class TimeoutError extends Error {
  constructor (...arg) {
    super(arg)
  }
}
/**
 * @class
 * Данные не валидны
 */
class ValidateDataError extends Error {
  constructor (...arg) {
    super(arg)
  }
}

class InvalidParamsError extends Error {
  constructor (...arg) {
    super(arg)
  }
}


module.exports = {
  NotFoundError,
  InvalidPropertyError,
  RequirePropertyError,
  TimeoutError,
  ValidateDataError,
  InvalidParamsError
}
