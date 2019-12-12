# Contributing to the Generator
This is an extension to the already existing contribution guideline outline in the [main repository](https://github.com/asyncapi/asyncapi/blob/master/CONTRIBUTING.md).

## Creating a new template
Each template should have defined integration tests located under `test/integration/templates`. see the [html.spec.js](./test/integration/templates/html.spec.js) as an example. We are using the integration tests to ensure that changes to the generate code does not give unintended side-effects when generating code with the templates. Therefore we need to specify actual verified generated files which the template integration tests use as a comparison. The following file strucutre are used:
```
./test/integration/templates
│ {{template}}.spec.js
└─── actual (generate when testing)
└─── expected
│    └─── {{template}}
└─── generation scripts
     │   generate.js
     └─── utils
          │   utils.js
          │   generate{{template}}.js
```
`{{template}}.spec.js` is the integration test for the given template which should generate code based on all the different parameters that it offers. `actual (generate when testing)` is where the generate code from the test will be located. `generation scripts` is the folder that contains all the scripts to generate the code from the templates. `generate{{template}}.js` is the file you need to create for your template, this should contain tests for each parameter your template provide. Use the existing scripts as guideline, since both the `generate.js` script and integration test `{{template}}.spec.js` should use them to reduce dublicated code and parameter missmatch. `generate.js` is the script file which generates all the templates, ensure to include your `generate{{template}}.js` file here. 


## Updating an existing template 
When the templates are updated in any form which results in a different output then previously a new set of expected generated files are required. To generate these run the following command in the root director:

`node ./test/integration/templates/generation\ scripts/generate.js` 

Ensure that you only made changes in the desired template, since this command will generate it for all templates. To generate for a specific template use the following command:

`node -e 'require("./test/integration/templates/generation\ scripts/utils/generate{{template}}.js")()'`

### Adding new parameter(s) to existing templates
If you are adding new parameter(s) to an existing template ensure to update the existing integration test `{{template}}.spec.js` and `generate{{template}}.js` script to include this new parameter(s). Then afterwards geneate the new expected files as shown above.
