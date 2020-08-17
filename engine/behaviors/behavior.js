'use strict'
var logger = require("../logger")

class Behavior {
    constructor(name, value = null) {
        this.name = name
        this.value = value
    }

    execute() {
        logger.info(`Executing behavior`, this.name)
        return true
    }

    getName() {
      return this.name
    }

    getValue() {
        return this.value
    }

}

module.exports = Behavior
