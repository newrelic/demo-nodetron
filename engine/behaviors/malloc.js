'use strict'
const { v4: uuidv4 } = require('uuid')
const NodeCache = require( "node-cache" )
const Behavior = require("./behavior")
const logger = require('../logger')

const Allocated = new NodeCache(
    { 
        stdTTL: 0,
        checkperiod: 0,
        maxKeys: -1
    })

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
        this.allocateKB(numberKb)
        return true
    }

    allocateKB(numberKb)
    {
        // 1KB is 64 guids (16 bytes)
        var key = uuidv4()
        var size = (numberKb*64)-1
        var data = []
        for (var index=0; index<size; index++)
        {
            var value = uuidv4()
            data.push(value)
        }
        Allocated.set(key, data)
    }
}

module.exports = Malloc
