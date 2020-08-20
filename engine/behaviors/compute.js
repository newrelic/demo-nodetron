'use strict'
const Behavior = require("./behavior")
const logger = require('../logger')

class Compute extends Behavior {
    constructor(value) {
        super("COMPUTE", value)
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
            logger.warning(`Could not get compute parameters for behavior, input expected is an array of 2 integers, got: ${this.getValue()}`)
            return
        }

        if (
            isNaN(parseInt(parsedValue[0])) ||
            isNaN(parseInt(parsedValue[1])) ||
            parsedValue[0] > parsedValue[1]
        ) {
            logger.warning(`Could not get valid compute parameters for behavior, min: ${parsedValue[0]} max: ${parsedValue[1]}`)
            return
        }
        
        const rangeStart = parsedValue[0]
        const rangeEnd = parsedValue[1]
        const difference = rangeEnd - rangeStart

        // Randomly select a duration length within the range
        const boxMuller = this.boxMullerTransform()
        const duration = rangeStart + (boxMuller * difference)
        
        const startTime = new Date().getTime()
        
        while((new Date().getTime() - startTime) < duration) {
            for (let i = 0; i < 50; i++) {
                for (let j = 0; j < i * 50; j++) {
                    // eslint-disable-next-line
                    const n = new Date().getTime() / Math.pow(Math.PI, Math.ceil(Math.random() * 10))
                }
            }
        }
        
        return true
    }
    
    /**
     * Returns a random value between 0 and 1 (not including 0), that value should follow a normal distribution
     */
    boxMullerTransform() {
        // Ensure there isn't a zero value
        const r1 = 1 - Math.random()
        const r2 = 1 - Math.random()

        // This is a Box Muller transform. Given 2 indepenent samples from a uniform distribution (Javascript's Math.random is uniform)
        // this formula will generate a random variable that will follow a normal distribution.
        // Source: https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
        const boxMuller = Math.sqrt(-2.0 * Math.log(r1)) * Math.cos(2.0 * Math.PI + r2)
        // Convert to a value between 0 and 1
        const decimalBM = boxMuller / 10.0 + 0.5

        return decimalBM
    }

}

module.exports = Compute
