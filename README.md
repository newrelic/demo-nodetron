[![Experimental Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#experimental)

# A/B Tester
A/B Tester is a demo application that conducts an A/B test on newsletter sign ups. Currently it just serves two versions of a sign up page, more coming soon!

### Requirements
#### Development
* Node.js ^14.15.4
* NPM     ^6.14.10
Move to the `engine` directory
```
cd engine/
```
Install dependencies
```
npm i
```
Run the application
```
node server.js config/app_config.js
```

#### Docker
This application can also be run through Docker.
```
docker build -t ab-tester .
```
Run the container
```
docker run -d -p 3001:3001 ab-tester
```

## Contributing

We encourage your contributions to improve ab-tester! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company,  please drop us an email at opensource@newrelic.com.

## License

ab-tester is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License. demo-nodetron also uses source code from third-party libraries. You can find full details on which libraries are used and the terms under which they are licensed in the [third-party notices document](./engine/THIRD_PARTY_NOTICES.md).
