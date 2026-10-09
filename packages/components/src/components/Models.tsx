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
import { missingAsyncAPIDocument } from '../utils/ErrorHandling';

/**
 * Represents the available format helpers for naming files.
 */
type Format = 'toPascalCase' | 'toCamelCase' | 'toKebabCase' | 'toSnakeCase';

/**
 * Represents the available programming languages for model generation.
 */
type Language = 'python' | 'java' | 'typescript' | 'rust' | 'csharp' | 'js';

/**
 * Represents any Modelina generator constructor.
 */
type ModelinaGeneratorConstructor =
  | typeof PythonGenerator
  | typeof JavaGenerator
  | typeof TypeScriptGenerator
  | typeof CSharpGenerator
  | typeof RustGenerator
  | typeof JavaScriptGenerator;

interface GeneratorConfigEntry {
  generator: ModelinaGeneratorConstructor;
  extension: string;
}

/**
 * Mapping of language strings to Modelina generator classes and file extensions.
 */
const generatorConfig: Record<Language, GeneratorConfigEntry> = {
  python: { generator: PythonGenerator, extension: 'py' },
  java: { generator: JavaGenerator, extension: 'java' },
  typescript: { generator: TypeScriptGenerator, extension: 'ts' },
  rust: { generator: RustGenerator, extension: 'rs' },
  csharp: { generator: CSharpGenerator, extension: 'cs' },
  js: { generator: JavaScriptGenerator, extension: 'js' },
};

type FormatHelperFn = (value: string) => string;

/**
 * Mapping of available format functions.
 */
const formatHelpers: Record<Format, FormatHelperFn> = {
  toPascalCase: FormatHelpers.toPascalCase,
  toCamelCase: FormatHelpers.toCamelCase,
  toParamCase: FormatHelpers.toParamCase,
  toSnakeCase: FormatHelpers.toSnakeCase,
};

interface ModelsProps {
  /** Parsed AsyncAPI document object. */
  asyncapi: unknown;
  /** Target programming language for the generated models. */
  language?: string;
  /** Naming format for generated files. */
  format?: string;
  /** Custom presets for the generator instance. */
  presets?: unknown;
  /** Custom constraints for the generator instance. */
  constraints?: unknown;
}

/**
 * Renders an array of model files based on the AsyncAPI document.
 *
 * @param props - Component props.
 * @returns Array of File components with generated model content.
 *
 * @example
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * import { Models } from "@asyncapi/generator-components";
 *
 * async function renderModel() {
 *    const parser = new Parser();
 *    const asyncapi_v3_path = path.resolve(__dirname, "../__fixtures__/asyncapi-v3.yml");
 *
 *     // Parse the AsyncAPI document
 *    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
 *    const parsedAsyncAPIDocument = parseResult.document;
 *
 *    const language = "java";
 *
 *    return (
 *      <Models
 *         asyncapi={parsedAsyncAPIDocument}
 *         language={language}
 *      />
 *    )
 * }
 *
 * renderModel().catch(console.error);
 *
 */
export async function Models({ asyncapi, language = 'python', format = 'toPascalCase', presets, constraints }: ModelsProps): Promise<JSX.Element[]> {
  if (!asyncapi) {
    throw missingAsyncAPIDocument();
  }
  // Get the selected generator and file extension, defaulting to Python if unknown
  const { generator: GeneratorClass, extension } = generatorConfig[language as Language] || generatorConfig.python;

  // Create the generator instance with presets and constraints
  const generatorOptions: Record<string, unknown> = {};
  if (presets) generatorOptions.presets = presets;
  if (constraints) generatorOptions.constraints = constraints;

  const generator = (presets || constraints)
    // Why: GeneratorClass is a runtime-selected union of 6 generator constructors with
    // mutually incompatible option types. `any` is the correct escape here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? new GeneratorClass(generatorOptions as any)
    : new GeneratorClass();

  // Get the format helper function, defaulting to toPascalCase if unknown
  const formatHelper = formatHelpers[format as Format] || formatHelpers.toPascalCase;

  // Generate models asynchronously
  const models = await generator.generate(asyncapi as Parameters<typeof generator.generate>[0]);
 
  return models.map(model => {
    const modelContent = model.result;
    const modelFileName = `${formatHelper(model.modelName)}.${extension}`;
    if (modelContent) return <File name={modelFileName}>{modelContent}</File>;
    return undefined as unknown as JSX.Element;
  });
}