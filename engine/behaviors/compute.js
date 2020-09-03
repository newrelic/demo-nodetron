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
        
        const start = parsedValue[0]
        const end = parsedValue[1]
        const duration = this.sample(start, end)

        const startTime = new Date().getTime()
        var now = new Date().getTime()
        while((now - startTime) < duration) {
            for (let i = 0; i < 50; i++) {
                for (let j = 0; j < i * 50; j++) {
                    now / Math.pow(Math.PI, Math.ceil(Math.random() * 10))
                }
            }
            now = new Date().getTime()
        }
        return true
    }

}

module.exports = Compute
