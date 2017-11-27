'use strict'

const _ = require('lodash')

module.exports = {
  migrate () {
    
    const migrations = require('require-all')(`${__dirname}/migrations`)

    const migrationsExec = _.map(migrations, (value, key) => {

      return value.migrate()
    })

    return migrationsExec
  },

  rollback () {
    return null
  }
}
