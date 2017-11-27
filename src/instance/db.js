'use strict'

const config = require('config')
const mongoose = require('mongoose')

const log = require('_/instance/log')

const uri = config.get('mongodb.connection')

mongoose.connect(uri)

const db = mongoose.connection

module.exports = new Promise((resolve, reject) => {
  db.once('error', error => {
    log.error('[DB]', error)

    reject(error)
  })
  db.once('open', () => {
    log.info('[DB] Initiated')
    log.info('[DB] Connect: %s', uri)

    resolve(null)
  })
})
