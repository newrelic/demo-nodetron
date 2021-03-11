'use strict'
const Behavior = require("./behavior")
const MySQLRepository = require('../mySQLRepository');

class InvalidQuery extends Behavior {
    constructor(value) {
        super("INVALID-QUERY", value)
    }

    async execute() {
        super.execute()
        const repository = MySQLRepository.getInstance()

        if (repository) {
            await repository.queryInvalidTable()
        }

        return true
    }
}

module.exports = InvalidQuery
