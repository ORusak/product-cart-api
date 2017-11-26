/*
*
*/

'use strict'

const swagger = require('_/lib/swagger')

module.exports = function swaggerUi (options) {
  return swagger.middleware.swaggerUi(options)
}
