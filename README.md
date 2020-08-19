[![Experimental Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#experimental)

# Demo Nodetron

![Test](https://github.com/newrelic/demo-nodetron/workflows/Test/badge.svg?event=push)

A nodeJS tron for the `demo` platform.

Nodetron is compatible with the [demo-deployer](https://github.com/newrelic/demo-deployer).

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


#### Demo-Deployer

Nodetron can be also be deployed with the [demo-deployer](https://github.com/newrelic/demo-deployer), and supports Logging and Logging in Context.
Nodetron can also be instrumented with browser, using the same nodejs agent definition.
Here is a deployer config example:

```json
{
  "services": [
    {
      "id": "node1",
      "destinations": ["host1"],
      "display_name": "Nodetron",
      "source_repository": "git@github.com:newrelic/demo-nodetron.git",
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

## Contributing

We encourage your contributions to improve demo-nodetron! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company,  please drop us an email at opensource@newrelic.com.

## License

demo-nodetron is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License. demo-nodetron also uses source code from third-party libraries. You can find full details on which libraries are used and the terms under which they are licensed in the [third-party notices document](./engine/THIRD_PARTY_NOTICES.md).
