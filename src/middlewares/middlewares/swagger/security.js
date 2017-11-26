/*
*
*/

'use strict'

const swagger = require('_/lib/swagger')

module.exports = function swaggerSecurity (options) {
  return swagger.middleware.swaggerSecurity(options.method)
}
