'use strict'
const fetch = require("node-fetch")
var logger = require("./logger")

async function innerFetchJson(url, json, headers = []){
  thing = console
  var method = "GET"
  var myHeaders = new fetch.Headers()
  myHeaders.append("Accept", "application/json")
  myHeaders.append("Content-Type", "application/json")
  if (headers != null) {
      headers.map(header => myHeaders.append(header.key, header.value))
  }
  const options = {
      method: method,
      headers: myHeaders,
      body: json
  }
  logger.info(`fetch(${url})`, myHeaders)
  return fetch(url, options)  
}

exports.fetchJson = innerFetchJson
