import { File } from '@asyncapi/generator-react-sdk';
import {
  PythonGenerator,
  JavaGenerator,
  TypeScriptGenerator,
  CSharpGenerator,
  RustGenerator,
  FormatHelpers,
  JavaScriptGenerator
} from '@asyncapi/modelina';

/**
 * @typedef {'toPascalCase' | 'toCamelCase' | 'toKebabCase' | 'toSnakeCase'} Format
 * Represents the available format helpers for naming files.
 */

/**
 * @typedef {'python' | 'java' | 'typescript' | 'rust' | 'csharp'} Language
 * Represents the available programming languages for model generation.
 */

/**
 * Mapping of language strings to Modelina generator classes and file extensions.
 * @type {Record<string, { generator: new (options?: object) => any; extension: string }>}
 */
const generatorConfig = {
  python: { generator: PythonGenerator, extension: 'py' },
  java: { generator: JavaGenerator, extension: 'java' },
  typescript: { generator: TypeScriptGenerator, extension: 'ts' },
  rust: { generator: RustGenerator, extension: 'rs' },
  csharp: { generator: CSharpGenerator, extension: 'cs' },
  js: { generator: JavaScriptGenerator, extension: 'js' },
};

/**
 * Mapping of available format functions.
 */
const formatHelpers = {
  toPascalCase: FormatHelpers.toPascalCase,
  toCamelCase: FormatHelpers.toCamelCase,
  toKebabCase: FormatHelpers.toKebabCase,
  toSnakeCase: FormatHelpers.toSnakeCase,
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
export async function Models({ asyncapi, language = 'python', format = 'toPascalCase', presets, constraints }) {
  // Get the selected generator and file extension, defaulting to Python if unknown
  const { generator: GeneratorClass, extension } = generatorConfig[language] || generatorConfig.python;

  // Create the generator instance with presets and constraints
  const generator = (presets || constraints) 
    ? new GeneratorClass({ ...(presets && { presets }), ...(constraints && { constraints }) })
    : new GeneratorClass();

  // Get the format helper function, defaulting to toPascalCase if unknown
  const formatHelper = formatHelpers[format] || formatHelpers.toPascalCase;

  // Generate models asynchronously
  const models = await generator.generate(asyncapi);
  console.log("Generated models:", models);
 
  return models.map(model => {
    const modelContent = model.result;
    console.log("Generated model:", model.modelName);
    const modelFileName = `${formatHelper(model.modelName)}.${extension}`;
    if (modelContent) return <File name={modelFileName}>{modelContent}</File>;
  });
}