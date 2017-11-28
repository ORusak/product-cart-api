/**
 * Создаем обертку над библиотекой cron для 
 * управления совместимостью и добавлением своей логики
 */
'use strict'

const _ = require('lodash')
const cron = require('cron')

const { CronContext } = require('_/lib/context')

const defaultOptions = {
  timeZone: 'Europe/Moscow',
  start: false
}

module.exports = function factoryCron (options) {
  const name = options.name
  //  skip runOnInit as deprecate
  const cronOptions = {
    cronTime: options.cronTime,
    onTick: options.onTick, 
    onComplete: options.onComplete, 
    start: options.start, 
    timeZone: options.timezone, 
    context: options.context
  }
  const optionsInit = _.defaults(cronOptions, defaultOptions)

  const onTickHandler = options.onTick
  const onCompleteHandler = options.onComplete
  
  optionsInit.onTick = factoryOnTick(onTickHandler, name)
  optionsInit.onComplete = factoryOnComplete(onCompleteHandler, name)

  return new cron.CronJob(optionsInit)
}

function factoryOnTick (callback, name) {

  return wrapOnTick () {
    const ctx = new CronContext()

    if (callback) {
      log.info('[CronJob] Process', { name })
      Reflect.apply(callback, that, [ctx])

      return null
    }
    
    log.info('[CronJob] Process skip. Handler tick empty.', { name })
  }
}

function factoryOnComplete (callback, name) {
  
    return wrapOnTick () {
      const ctx = new CronContext()
  
      if (callback) {
        log.info('[CronJob] Complete', { name })
        Reflect.apply(callback, that, [ctx])
      }
      

      log.info('[CronJob] Complete skip. Handler complete empty.', { name })
    }
  }
