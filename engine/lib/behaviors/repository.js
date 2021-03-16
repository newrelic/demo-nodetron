'use strict'
const appConfig = require('../appConfig')
const ThrowException = require('./throwException')
const Compute = require('./compute')
const Malloc = require('./malloc')
const InvalidQuery = require('./invalidQuery')

const MySQLRepository = require('../mySQLRepository')

class Repository {

  constructor(availableBehaviors = Repository.GetAvailableBehaviors(), behaviorFactoryFunc = Repository.Factory, behaviorLookupFunc = null, appConfigLookupFunc = null) {
    this.availableBehaviors = availableBehaviors
    this.behaviorFactoryFunc = behaviorFactoryFunc
    this.behaviorLookupFunc = behaviorLookupFunc || function(req, key) { return req.get(key) }
    this.appConfigLookupFunc = appConfigLookupFunc || function() { return appConfig.getInstance() }

    this.behaviorsHeaderKey = "X-DEMO"
  }

  static GetAvailableBehaviors() {
    return ['THROW', 'COMPUTE', 'MALLOC', 'INVALID-QUERY']
  }

  /**
   * Instantiates behaviors
   * @param {String} name The name of the behavior, options are available in the exported `availableBehaviors` array
   * @param {*} value The value associated with the behavior, it can be different for each one
   * @returns {ThrowException|Compute|Malloc|InvalidQuery}
   */
  static Factory(name, value) {
    const config = this.appConfigLookupFunc()
    const repo = MySQLRepository.getInstance(config.getMySQLConfiguration())

    switch (name) {
      case 'THROW':
        return new ThrowException()
      case 'COMPUTE':
        return new Compute(value)
      case 'MALLOC':
        return new Malloc(value)
      case 'INVALID-QUERY':
        return new InvalidQuery(repo)
      default:
        return null
    }
  }

  getByRequest(req, step) {
    let behaviors = this.availableBehaviors.map(name => this.findBehaviors(name, req, step))
    behaviors = behaviors.filter(b => b !== null) // Remove any null values
    return behaviors;
  }

  findBehaviors(name, req, step) {
    const appId = this.appConfigLookupFunc().getAppId()
    const key = `${this.behaviorsHeaderKey}-${name}-${step}`
    const keyWithAppId = `${this.behaviorsHeaderKey}-${name}-${step}-${appId}`

    let behavior = this.lookupAndCreate(key, name, req)
    const targetedBehavior = this.lookupAndCreate(keyWithAppId, name, req)
    if (targetedBehavior !== null) {
      behavior = targetedBehavior
    }
    return behavior
  }

  lookupAndCreate(key, name, req) {
    const value = this.behaviorLookupFunc(req, key)
    if (value == null || value == undefined) {
      return null
    }

    return this.behaviorFactoryFunc(name, value)
  }

}

module.exports = Repository
