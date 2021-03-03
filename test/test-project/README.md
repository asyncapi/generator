It is a test project where AsyncAPI Generator and AsyncAPI html-template are used as Node.js dependencies.
The purpose of this project is to test AsyncAPI Generator library use case outside the Generator code base.

The version of the html-template must be hardcoded to version `0.16.0` because tests check if output is generated using this given version of the template, that newer version is not downloaded even though `0.16.0` was installed with `npm install` first.