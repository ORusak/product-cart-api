/**
 * 
*/

const Context = require('./context')

class RequestContext extends Context {

  constructor (request) {
    const options = {
      user: null,
      ip: request.headers['x-forwarded-for'] || request.connection.remoteAddress
    }

    super(options)
  }
}

module.exports = RequestContext
