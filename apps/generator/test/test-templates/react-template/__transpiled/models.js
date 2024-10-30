'use strict';

require('source-map-support/register');
var generatorReactSdk = require('@asyncapi/generator-react-sdk');
require('@asyncapi/parser');
var modelina = require('@asyncapi/modelina');
var jsxRuntime = require('/Users/karinagornicka/Documents/GitHub/generator/node_modules/react/cjs/react-jsx-runtime.production.min.js');

const generatorConfig = {
  python: {
    generator: modelina.PythonGenerator,
    extension: 'py'
  },
  java: {
    generator: modelina.JavaGenerator,
    extension: 'java'
  },
  typescript: {
    generator: modelina.TypeScriptGenerator,
    extension: 'ts'
  },
  rust: {
    generator: modelina.RustGenerator,
    extension: 'rs'
  },
  csharp: {
    generator: modelina.CSharpGenerator,
    extension: 'cs'
  }
};

/**
 * Mapping of available format functions.
 */
const formatHelpers = {
  toPascalCase: modelina.FormatHelpers.toPascalCase,
  toCamelCase: modelina.FormatHelpers.toCamelCase,
  toKebabCase: modelina.FormatHelpers.toKebabCase,
  toSnakeCase: modelina.FormatHelpers.toSnakeCase
  // Add more formats as needed
};

/**
 * Generates and returns an array of model files based on the AsyncAPI document.
 * 
 * @param {Object} params - The parameters for the function.
 * @param {AsyncAPIDocumentInterface} params.asyncapi - Parsed AsyncAPI document object.
 * @param {Language} [params.language='python'] - Target programming language for the generated models.
 * @param {Format} [params.format='toPascalCase'] - Naming format for generated files.
 * @param {object} [params.presets={}] - Custom presets for the generator instance.
 * @param {object} [params.constraints={}] - Custom constraints for the generator instance.
 * 
 * @returns {Array<File>} Array of File components with generated model content.
 */
async function Models({
  asyncapi,
  language = 'python',
  format = 'toPascalCase',
  presets,
  constraints
}) {
  // Get the selected generator and file extension, defaulting to Python if unknown
  const {
    generator: GeneratorClass,
    extension
  } = generatorConfig[language] || generatorConfig.python;

  // Create the generator instance with presets and constraints
  const generator = presets || constraints ? new GeneratorClass({
    ...(presets && {
      presets
    }),
    ...(constraints && {
      constraints
    })
  }) : new GeneratorClass();

  // Get the format helper function, defaulting to toPascalCase if unknown
  const formatHelper = formatHelpers[format] || formatHelpers.toPascalCase;

  // Generate models asynchronously
  const models = await generator.generate(asyncapi);
  return models.map(model => {
    const modelFileName = `${formatHelper(model.modelName)}.${extension}`;
    return /*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.File, {
      name: modelFileName,
      children: model.result
    });
  });
}

//import { Models } from '@asyncapi/generator-components';

async function models ({
  asyncapi
}) {
  return await Models({
    asyncapi,
    language: 'csharp'
  });
}

module.exports = models;
//# sourceMappingURL=models.js.map
