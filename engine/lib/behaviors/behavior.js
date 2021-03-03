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

    /**
     * Returns a random value between start and end, that value should follow a normal distribution
     */
    sample(start, end) {
        // Ensure there isn't a zero value
        const r1 = 1 - Math.random()
        const r2 = 1 - Math.random()

        // This is a Box Muller transform. Given 2 indepenent samples from a uniform distribution (Javascript's Math.random is uniform)
        // this formula will generate a random variable that will follow a normal distribution.
        // Source: https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
        const boxMuller = Math.abs(Math.sqrt(-2.0 * Math.log(r1)) * Math.cos(2.0 * Math.PI + r2))
        // Convert to a value between 0 and 1
        const decimalBM = boxMuller / 10.0 + 0.35
        const pick = decimalBM  - Math.floor(decimalBM)
        const value = start + (pick * (end - start))
        return Math.round(value)
    }

}

module.exports = Behavior
