It is a test project where AsyncAPI Generator and test template are used as Node.js dependencies.
The purpose of this project is to test AsyncAPI Generator library use case outside the Generator code base.

Instead of running tests with `npm test`, make sure you have Docker Compose and run `docker-compose rm -f -s test-project verdaccio && NODE_IMAGE_TAG=18 docker-compose up --abort-on-container-exit --remove-orphans`.