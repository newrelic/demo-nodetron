'use strict'
const startedAt = require("./startedAt")

class Modules{
    constructor(){
        this.modules = []
        this.modules.push(new startedAt())
    }

    get(){
        return this.modules.map(x => x.get())
    }
}

module.exports = Modules
