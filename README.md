# V3-Nodetron
A nodeJS tron for V3.

Nodetron is compatible with the [V3-Deployer](https://github.com/newrelic/demo-deployer).

It can be deployed with a similar configuration, and can participate in a tron chain with other trons like itself or other languages.
The simulator can also be used to drive traffic to Nodetron.

### Behaviors

Nodetron supports the below behaviors. For more information, see the Behavior Documentation.

* Throw
* Compute

### Configuration

The Nodetron configuration is located in a json configuration file, typically stored under the /config folder. It is similar the the other tron config structure. Here is an example showing 2 app dependencies:

```json
{
  "id": "nodetron2",
  "port": 3002,
  "dependencies": [
    {
      "id":"app2",
      "urls":["http://localhost:5002"]
    },
    {
      "id":"app3",
      "urls":["http://localhost:5003"]
    }
  ]
}
```


#### V3-Deployer

Nodetron can be deployed with the V3-Deployer, and supports Logging and Logging in Context.
Nodetron can also be instrumented with browser, using the same nodejs agent definition.
Here is a V3-Deployer config example:


```json
{
  "services": [
    {
      "id": "node1",
      "destinations": ["host1"],
      "display_name": "Nodetron",
      "source_repository": "git@github.com:newrelic/demo-nodeapp.git",
      "deploy_script_path": "/deploy/linux/roles",
      "port": 3002
    }
  ],
  "resources": [
    {
      "id": "host1",
      "provider": "aws",
      "type": "ec2",
      "size": "t2.micro"
    }
  ],
  "instrumentations": {
    "services":[
      {
        "id": "nr_node_agent",
        "service_ids": ["node1"],
        "provider": "newrelic",
        "source_repository": "git@github.com:newrelic/demo-instrumentation.git",
        "deploy_script_path": "deploy/node/linux/roles",
        "version": "6.4.1"
      },
      {
        "id": "nr_logging_in_context",
        "service_ids": ["node1"],
        "provider": "newrelic",
        "source_repository": "git@github.com:newrelic/demo-instrumentation.git",
        "deploy_script_path": "deploy/logging_in_context/roles"
      }
    ]
  }
}
```


### Docker support

Nodetron can be run in docker. A dockerfile is available at the root, you can use the commands below to build the image, run the test and run nodetron itself with the default config example

```
docker build -t nodetron .
docker run -it --entrypoint npm nodetron test
docker run -it -p 3001:3001 nodetron
```
