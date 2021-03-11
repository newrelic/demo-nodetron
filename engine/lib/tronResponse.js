'use strict'
var appConfig = require('./appConfig')
var logger = require("./logger")
var httpUtil = require("./httpUtil")

class TronResponse{
    constructor(configLoader = null){
      this.configLoader = configLoader || function(){return appConfig.getInstance()}
      this.traceHeaderKey = "X-DEMOTRON-TRACE"
      this.demoHeaderKey  = "X-DEMO"
      this.headerMap = new Map()
      this.headerMap.set('Access-Control-Allow-Origin', '*')
      this.headerMap.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
      this.headerMap.set('Content-type', 'application/json')
    }

    setTraceHeader(value){
      this.headerMap.set(this.traceHeaderKey, value)
    }

    getHeader(key){
      return this.headerMap.get(key)
    }

    getTraceHeader(){
      return this.headerMap.get(this.traceHeaderKey)
    }

    getTraceHttpRequestHeader(http){
      return http.header(this.traceHeaderKey)
    }

    getTraceHttpResponseHeader(response){
      return response.headers.get(this.traceHeaderKey)
    }

    setupDownStreamHeaders(httpRequest){
      this.addDemoHeaders(httpRequest)
      this.addMyTraceHeader(httpRequest)
    }

    addDemoHeaders(httpRequest){
      Object.keys(httpRequest.headers).forEach((key) => {
        if (key.toUpperCase().indexOf(this.demoHeaderKey) > -1) {
          var value = httpRequest.header(key)
          this.headerMap.set(key, value)
        }
      })
    }

    addMyTraceHeader(httpRequest){
      var currentTrace = this.getTraceHttpRequestHeader(httpRequest)
      if (currentTrace != undefined){
        var config = this.configLoader()
        if (config != null){
          var appId = config.getAppId()
          this.setTraceHeader(appId)
          return true
        }
        logger.error('addMyTraceHeader() could not set trace header because appConfig instance is undefined', 'skipping')
      }
      return false
    }

    async fetchDownstream(url){
      var headers = []
      if (this.getTraceHeader() != undefined) {
        headers.push({key: this.traceHeaderKey, value: '1'})
      }

      for (const [key, value] of this.headerMap) {
        headers.push({key: key, value: value})
      }

      var downstreamResponse = await httpUtil.fetchJson(url, null, headers)
      .catch(error => {
        var message = `An error occurred during a downstream request to ${url} detail:${error}`
        throw new Error(message)
      })

      this.appendTrace(downstreamResponse)

      return downstreamResponse
    }

    async executeDownstream(endpoint) {
      var config = appConfig.getInstance()
      var urls = config.getDependencyEndpoint(endpoint)
      var requests = urls.map(url => this.fetchDownstream(url))
      await Promise.all(requests)
    }

    appendTrace(downstreamResponse){
      var currentTrace = this.getTraceHeader()
      if (currentTrace != undefined){
        var downstreamTrace = this.getTraceHttpResponseHeader(downstreamResponse)
        if (downstreamTrace != undefined){
          var newTrace =  currentTrace +"," +downstreamTrace
          this.setTraceHeader(newTrace)
          return true
        }
      }
      return false
    }

    buildJsonResponse(httpResponse, data){
      for (const [key, value] of this.headerMap) {
        httpResponse.header(key, value)
      }
      httpResponse.json(data)
    }

}

module.exports = TronResponse
