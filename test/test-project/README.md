It is a test project where AsyncAPI Generator and AsyncAPI html-template are used as Node.js dependencies.
The purpose of this project is to test AsyncAPI Generator library use case outside the Generator code base.

The version of the html-template must be hardcoded to version `0.16.0` because tests check if output is generated using this given version of the template, that newer version is not downloaded even though `0.16.0` was installed with `npm install` first.

There are two custom test scripts:
- `npm test:project` starts library integration tests that can run the same way both on local and CI
- `npm test:global` always fail on local as it tests installation of template under global location. This would mean you have to install template globally before running the test. It means messing with your developer setup. Instead you have a docker compose configuration that you can use to run all tests from the test project in an isolated environment
- `npm test:registry` is for testing arborist functionality to use custom private registry

Instead of running tests with `npm test`, make sure you have Docker Compose and run `NODE_IMAGE_TAG=14 docker-compose up`.