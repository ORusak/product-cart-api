'use strict'

const mongoose = require('mongoose')
const createMongooseSchema = require('json-schema-to-mongoose')

const schemaJSON = require('./schema-json')

module.exports = mongoose.Schema(createMongooseSchema(null, schemaJSON))
