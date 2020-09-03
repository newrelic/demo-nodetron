'use strict'
const Behavior = require("./behavior")
const logger = require('../logger')

class Malloc extends Behavior {
    constructor(value) {
        super("MALLOC", value)
    }

    execute() {
        super.execute()

        let parsedValue = undefined
        try {
            parsedValue = JSON.parse(this.getValue())
        }
        catch (error) {
            // The block below will catch this case
        }

        if (!parsedValue || parsedValue.length < 2) {
            logger.warning(`Could not get malloc parameters for behavior, input expected is an array of 2 integers, got: ${this.getValue()}`)
            return
        }

        if (
            isNaN(parseInt(parsedValue[0])) ||
            isNaN(parseInt(parsedValue[1])) ||
            parsedValue[0] > parsedValue[1]
        ) {
            logger.warning(`Could not get valid malloc parameters for behavior, min: ${parsedValue[0]} max: ${parsedValue[1]}`)
            return
        }

        const start = parsedValue[0]
        const end = parsedValue[1]
        const numberKb = this.sample(start, end)
        logger.info(`Allocating ${numberKb}KB`)
        return true
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

module.exports = Malloc
