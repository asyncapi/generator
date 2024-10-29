import { File } from '@asyncapi/generator-react-sdk';
import { PythonGenerator, JavaGenerator, TypeScriptGenerator, FormatHelpers } from '@asyncapi/modelina';

/**
 * @typedef {'python' | 'java' | 'typescript'} Language
 * Represents the available programming languages for model generation.
 */

/**
 * @typedef RenderArgument
 * @type {object}
 * @property {AsyncAPIDocument} asyncapi AsyncAPI document object received from the generator after initial parsing with parser-js.
 * @property {Language} [language='python'] The target programming language for the generated models.
 */

/**
 * Mapping of language strings to Modelina generator classes and file extensions.
 */
const generatorConfig = {
    python: { generator: PythonGenerator, extension: 'py' },
    java: { generator: JavaGenerator, extension: 'java' },
    typescript: { generator: TypeScriptGenerator, extension: 'ts' },
  };

/**
 * Render all schema models
 * @param {RenderArgument} param0 
 * @returns {Array<File>} Array of File components with generated model content.
 */
export default async function models({ asyncapi, language = 'python' }) {
    // Get the selected generator and file extension, defaulting to Python if unknown
    const { generator: GeneratorClass, extension } = generatorConfig[language] || generatorConfig.python;
    const generator = new GeneratorClass();
  
    const models = await generator.generate(asyncapi);
    const files = [];
  
    for (const model of models) {
      const modelFileName = `${FormatHelpers.toPascalCase(model.modelName)}.${extension}`;
      files.push(<File name={modelFileName}>{model.result}</File>);
    }
  
    return files;
  }