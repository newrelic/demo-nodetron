var assert = require('assert')
var appConfig = require('../lib/appConfig')

describe(`AppConfig Test`, function () {
    it(`should have an id`, function() {
        var appConfig = AppConfigTest.givenAppConfig("identity1")
        assert.equal(appConfig.getAppId(), "identity1")
    })

    it(`should have a port`, function() {
        var appConfig = AppConfigTest.givenAppConfig("identity1", 3004)
        assert.equal(appConfig.getPort(), 3004)
    })

    it(`should have delayStartMs`, function() {
        var appConfig = AppConfigTest.givenAppConfig("identity1", 3004, 150)
        assert.equal(appConfig.getDelayStartMs(), 150)
    })

    it(`should have a single dependency`, function() {
        var appConfig = AppConfigTest.givenAppConfig("identity1", 3004, 0, [{"id":"app2", urls:["https://somewhere.newrelic.com/api"]}])
        var dependencyEndpoints = appConfig.getDependencyEndpoint("/endpoint1")
        assert.equal(dependencyEndpoints.length, 1)
        assert.equal(dependencyEndpoints[0], "https://somewhere.newrelic.com/api/endpoint1")
    })
    
    it(`should fetch all single dependency urls`, function() {
        var appConfig = AppConfigTest.givenAppConfig("identity1", 3004, 0, [{"id":"app2", urls:["https://somewhere.newrelic.com/api", "https://else.newrelic.com/api"]}])
        var dependencyEndpoints = appConfig.getDependencyEndpoint("/endpoint1")
        assert.equal(dependencyEndpoints.length, 2)
        assert.equal(dependencyEndpoints[0], "https://somewhere.newrelic.com/api/endpoint1")
        assert.equal(dependencyEndpoints[1], "https://else.newrelic.com/api/endpoint1")
    })

    it(`should have all dependencies`, function() {
        var appConfig = AppConfigTest.givenAppConfig("identity1", 3004, 0, [{"id":"app2", urls:["https://somewhere.newrelic.com/api"]},{"id":"app3", urls:["https://else.newrelic.com/api"]}])
        var dependencyEndpoints = appConfig.getDependencyEndpoint("/endpoint1")
        assert.equal(dependencyEndpoints.length, 2)
        assert.equal(dependencyEndpoints[0], "https://somewhere.newrelic.com/api/endpoint1")
        assert.equal(dependencyEndpoints[1], "https://else.newrelic.com/api/endpoint1")
    })

    it(`should have a configured database`, function() {
        var config = { name: 'testdb', port: '3001', host: 'fakehost', user: 'fakeuser', password: 'fakepass' }
        var appConfig = AppConfigTest.givenAppConfig("testtron", 3000, 0, null, config)
        assert.deepStrictEqual(appConfig.getMySQLConfiguration(), config)
    })

    it(`should NOT have a configured database`, function() {
        var appConfig = AppConfigTest.givenAppConfig("testtron", 3000, 0)
        assert.equal(appConfig.getMySQLConfiguration(), null)
    })

    it(`should NOT have a configured database with partial config values`, function() {
        var config = { name: 'testdb', port: '', host: 'fakehost', password: 'fakepass' }
        var appConfig = AppConfigTest.givenAppConfig("testtron", 3000, 0, null, config)
        assert.equal(appConfig.getMySQLConfiguration(), null)
    })
})

class AppConfigTest{
    static givenAppConfig(id, port = 3000, delayStartMs = 0, dependencies = null, dbConfig = { name: '', port: '', host: '', user: '', password: '' }){
        var raw = {
            "id": id,
            "port": port,
            "delayStartMs": delayStartMs,
            "database": dbConfig
        }
        if (dependencies != null && dependencies.length>0){
            raw["dependencies"] = dependencies
        }
        var json = JSON.stringify(raw)
        return new appConfig("", function(){return JSON.parse(json)})
    }
}

module.exports = AppConfigTest
