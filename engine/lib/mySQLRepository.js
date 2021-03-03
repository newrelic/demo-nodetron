'use strict';

const knex = require('knex')

const logger = require('./logger')
const inventoryLoader = require("./inventoryLoader")

class DatabaseRepository {
  constructor(databaseName, databaseConfiguration, invLoader = inventoryLoader) {
    this._databaseName = databaseName
    this._connection = undefined
    this._invLoader = invLoader

    const { host, port, user, password } = databaseConfiguration
    this._configuration = {
      host,
      port,
      user,
      password,
      database: databaseName,
      charset: 'utf8'
    }
  }

  async initialize() {
    logger.info('Initializing MySQL database')
    const tableName = 'inventory'
    await this.createDatabase()

    const connection = knex({
      client: 'mysql',
      connection: this._configuration
    })

    await connection.schema.dropTableIfExists(tableName)

    logger.info('Creating table with name: inventory')
    await connection.schema.createTable('inventory', table => {
      table.string('id')
      table.string('item')
      table.string('price')
      table.string('sku')
      table.string('description')
    })

    const inventoryData = this._invLoader()
    for (const item of inventoryData) {
      logger.info(`Inserting inventory with id: ${item.id}`)
      await connection(tableName).insert(item)
    }

    this._connection = connection
 }

  async createDatabase() {
    const config = this._configuration

    const rawConnection = knex({
      client: 'mysql',
      connection: {
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password 
      }
    })

    logger.info(`Creating database with name: ${this._databaseName}`)
    await rawConnection.raw(`CREATE DATABASE IF NOT EXISTS ${this._databaseName}`)
    rawConnection.destroy()
  }

  async findAll() {
    if (!this._connection) {
      await this.initialize()
    }

    const results = await this._connection.select().from('inventory')
    return results
  }

  async findOrNull(id) {
    if (!this._connection) {
      await this.initialize()
    }

    const results = await this._connection.select().from('inventory').where({ id })
    if (results.length > 0) {
      return results[0]
    }

    return null
  }
}

module.exports = DatabaseRepository
