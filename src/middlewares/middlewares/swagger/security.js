/*
*
*/

'use strict'

const swagger = require('_/lib/swagger')

module.exports = function factory (options) {
  return swagger.middleware.swaggerSecurity(options.method)
}
