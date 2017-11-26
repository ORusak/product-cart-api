'use strict'

const { 
    getList
} = require('_/controller/product')

module.exports = {
    getList: getList.run.bind(getList)
}
