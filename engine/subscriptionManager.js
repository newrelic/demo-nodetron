'use strict'

const { v4: uuid } = require('uuid')
const logger = require('./common/logger')

/**
 * Manages subscriptions
 **/
class SubscriptionManager {
  constructor() {
    this._subs = []
    this._weightedRandomFn = this._initWeightedRandomFunction()
  }

  /**
   * Returns all subscriptions
   * returns {Object[]} 
   **/
  getUnsubscriptions() {
    return this._subs.filter(s => s.unsubscribe_datetime)
  }

  /**
   * Add a new subscription
   * @param {String} 'a' or 'b' the version of page
   **/
  add(version) {
    const newSub = {
      id: uuid(),
      version: version.toLowerCase(),
      unsubscribe_datetime: undefined
    }

    logger.info(`Adding new subscription from page ${version}`)
    this._subs.push(newSub)
    this._rollEntries()
  }

  /**
   * Unsubscribe an entry, adds the unsubscribe_datetime field.
   * Uses a weighted random function to determine which entry to unsubscribe.
   **/
  unsubscribe() {
    const version = this._weightedRandomFn()
    const filteredSubs = this._subs.filter(s => s.version === version)
    const unsubIndex = Math.floor(Math.random() * filteredSubs.length)
    const currentDateTime = new Date().toISOString()
    const unsub = filteredSubs[unsubIndex]
    
    if (unsub) {
      logger.info(`Unsubscription from ${version}`)
      unsub.unsubscribe_datetime = currentDateTime
    }
  }

  /**
   * Initializes the weighted random function
   * @return {Function} A function that returns 'a' or 'b' weighted toward 'b'
   **/
  _initWeightedRandomFunction() {
    const table = []
    const bUnsubRate = 70
    for (let i = 0; i < 100; i++) {
      table[i] = i < bUnsubRate ? 'b' : 'a'
    }

    return () => table[Math.floor(Math.random() * table.length)]
  }

  _rollEntries() {
    logger.info('Rolling subscription entries')
    const extra = this._subs.length - 1000
    const toRemove = extra > 0 ? extra : 0;

    this._subs = this._subs.slice(toRemove)
    logger.info(`Removed ${toRemove} subscription entries`)
  }
}

module.exports = SubscriptionManager
