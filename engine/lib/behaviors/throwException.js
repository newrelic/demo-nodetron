'use strict'
const Behavior = require("./behavior")

class ThrowException extends Behavior {
    constructor(){
        super("THROW")
    }

    execute(){
        super.execute()
        var unreferenced = null
        return unreferenced.execute()
    }

}

module.exports = ThrowException
