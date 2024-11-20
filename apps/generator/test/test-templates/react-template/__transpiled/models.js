'use strict';

require('source-map-support/register');
var generatorComponents = require('@asyncapi/generator-components');

async function models ({
  asyncapi
}) {
  return await generatorComponents.Models({
    asyncapi,
    language: 'csharp'
  });
}

module.exports = models;
//# sourceMappingURL=models.js.map
