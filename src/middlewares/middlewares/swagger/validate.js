/*
*
*/

'use strict'

const swagger = require('_/lib/swagger')

module.exports = function swaggerValidator (options) {
  return swagger.middleware.swaggerValidator(options)
}
