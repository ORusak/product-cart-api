'use strict'

const getList = require('./get-list')

module.exports = {
  getList: getList.run.bind(getList)
}
