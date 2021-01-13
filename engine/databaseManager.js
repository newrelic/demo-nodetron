'use strict';

const knex = require('knex')

const inventoryStore = require('./inventoryStore')
let instance = new inventoryStore("data/inventory.json")

class DatabaseManager {
  constructor(databaseName, databaseConfiguration) {
    this._databaseName = databaseName
    this._connection = undefined

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
    const tableName = 'inventory'
    await this.createDatabase()

    const connection = knex({
      client: 'mysql',
      connection: this._configuration
    })

    await connection.schema.dropTableIfExists(tableName)

    await connection.schema.createTable('inventory', table => {
      table.string('id')
      table.string('item')
      table.string('price')
      table.string('sku')
      table.string('description')
    })

    const inventoryData = instance.findAll()
    for (const item of inventoryData) {
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

    await rawConnection.raw(`CREATE DATABASE IF NOT EXISTS ${this._databaseName}`)
    rawConnection.destroy()
  }

  async query() {
    if (!this._connection) {
      await this.initialize()
    }

    return this._connection.select().from('inventory')
  }
}

module.exports = DatabaseManager
