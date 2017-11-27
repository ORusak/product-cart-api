'use strict'

const path = require('path')
const mongoose = require('mongoose')
const createMongooseSchema = require('json-schema-to-mongoose')

//  используем ту же схему что и на валидацию ответа сервера
const root = process.cwd()
const fs = require('fs')
const schemaJSON = JSON.parse(
  fs.readFileSync(path.join(root, 'api', 'schema', 'product', 'product.jsd'), { encoding: 'utf-8' })
)

module.exports = mongoose.Schema(createMongooseSchema(null, schemaJSON))
