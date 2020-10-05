'use strict'
const fetch = require("node-fetch")
var logger = require("./logger")

async function innerFetchJson(url, json, headers = []){
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
    .then(response => {
        if (!response.ok) { throw new Error(`response code ${response.status}`) }
        else { return new Promise(response) }
    })
    .catch(error => {
      return Promise.reject(error.message)
    })
}

exports.fetchJson = innerFetchJson
