/*
*
*/

'use strict'

const swagger = require('_/lib/swagger')

module.exports = function swaggerMetadata (options) {
  return swagger.middleware.swaggerMetadata()
}
