'use strict'
const Behavior = require("./behavior")

class InvalidQuery extends Behavior {
    constructor(repository) {
        super("INVALID-QUERY", undefined)
        this.repository = repository
    }

    async execute() {
        super.execute()

        if (this.repository) {
            await this.repository.queryInvalidTable()
        }

        return true
    }
}

module.exports = InvalidQuery
