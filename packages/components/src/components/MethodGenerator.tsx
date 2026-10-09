import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage, negativeIndent, invalidMethodName, invalidNewLines, invalidMethodParams } from '../utils/ErrorHandling';

/**
 * Supported programming languages.
 */
type Language = 'python' | 'javascript' | 'dart' | 'java';

/**
 * Configuration for method syntax based on programming language.
 */
interface MethodSyntaxConfig {
  returnType?: string;
  openingTag?: string;
  closingTag?: string;
  indentSize?: number;
  parameterWrap?: boolean;
}

/**
 * Configuration for method docs and logic per language.
 */
interface MethodDocsLogic {
  methodDocs?: string;
  methodLogic?: string;
}

/**
 * Method config can be a flat docs/logic object or a nested framework map.
 */
type MethodConfigEntry = MethodDocsLogic | Record<string, MethodDocsLogic>;

/**
 * Full method config keyed by language.
 */
type MethodConfig = Partial<Record<Language, MethodConfigEntry>>;

const defaultMethodConfig: Record<Language, MethodSyntaxConfig> = {
  python: { returnType: 'def', openingTag: ':', indentSize: 2, parameterWrap: true },
  javascript: { openingTag: '{', closingTag: '}', indentSize: 2, parameterWrap: true },
  dart: { returnType: 'void', openingTag: '{', closingTag: '}', indentSize: 2, parameterWrap: true },
  java: { returnType: '', openingTag: '', closingTag: '', indentSize: 0, parameterWrap: false }
};

interface ResolveDocsAndLogicParams {
  language: string;
  methodDocs?: string;
  methodLogic?: string;
  methodConfig?: MethodConfig;
  framework?: string;
}

/**
 * Resolve docs and logic for the given language + framework config.
 *
 * @private
 */
const resolveDocsAndLogic = ({ language, methodDocs, methodLogic, methodConfig, framework }: ResolveDocsAndLogicParams): { docs: string | undefined; logic: string | undefined } => {
  let docs = methodDocs;
  let logic = methodLogic;

  if (methodConfig && methodConfig[language as Language]) {
    const config = methodConfig[language as Language] as Record<string, unknown>;

    if (framework && config[framework]) {
      const frameworkConfig = config[framework] as MethodDocsLogic;
      docs = frameworkConfig.methodDocs ?? methodDocs;
      logic = frameworkConfig.methodLogic ?? methodLogic;
    } else if ((config as MethodDocsLogic).methodLogic || (config as MethodDocsLogic).methodDocs) {
      docs = (config as MethodDocsLogic).methodDocs ?? methodDocs;
      logic = (config as MethodDocsLogic).methodLogic ?? methodLogic;
    }
  }

  return { docs, logic };
};

/**
 * Build indented method body.
 *
 * @private
 */
const buildIndentedLogic = (logic: string | undefined, preExecutionCode: string, postExecutionCode: string, indentSize: number): string => {
  let completeCode = logic || '';
  if (preExecutionCode) completeCode = `${preExecutionCode}\n${completeCode}`;
  if (postExecutionCode) completeCode = `${completeCode}\n${postExecutionCode}`;

  const innerIndent = ' '.repeat(indentSize);
  return completeCode
    .split('\n')
    .map(line => (line ? `${innerIndent}${line}` : ''))
    .join('\n');
};

export interface MethodGeneratorProps {
  /** Programming language used for method formatting. */
  language: string;
  /** Name of the method (non-empty string required). */
  methodName: string;
  /** Method parameters. */
  methodParams?: string[];
  /** Optional documentation string. */
  methodDocs?: string;
  /** Core method logic. */
  methodLogic?: string;
  /** Code before main logic. */
  preExecutionCode?: string;
  /** Code after main logic. */
  postExecutionCode?: string;
  /** Indentation for the method block (must be >= 0). */
  indent?: number;
  /** Number of new lines after method. */
  newLines?: number;
  /** Optional custom syntax configuration for the current language. */
  customMethodConfig?: MethodSyntaxConfig;
  /** Language-level or framework-level configuration. */
  methodConfig?: MethodConfig;
  /** Framework name for nested configurations (e.g., 'quarkus' for Java). */
  framework?: string;
}

/**
 * Renders a language-specific formatted method definition.
 *
 * @param props - Component props.
 * @returns A Text component that contains method block with appropriate formatting.
 * @throws If language is unsupported, methodName is invalid, or indent is negative.
 *
 * @example
 * import { MethodGenerator } from "@asyncapi/generator-components";
 * const language = "java";
 * const methodName = "registerHandler";
 * const methodParams = ["Handler handler"];
 * const methodDocs = "// Process the input data.";
 * const methodLogic = "// TODO: implement";
 * const preExecutionCode = "// Before handler registration";
 * const postExecutionCode = "// After handler registration";
 * const customMethodConfig={ openingTag: "{", closingTag: "}", indentSize: 6 };
 * const methodConfig = {"java" : {"quarkus": {methodDocs : methodDocs, methodLogic: methodLogic }}};
 * const framework = "quarkus";
 *
 * function renderMethodGenerator() {
 *   return (
 *     <MethodGenerator
 *        language={language}
 *        methodName={methodName}
 *        methodParams={methodParams}
 *        methodDocs={methodDocs}
 *        methodLogic={methodLogic}
 *        preExecutionCode={preExecutionCode}
 *        postExecutionCode={postExecutionCode}
 *        customMethodConfig={customMethodConfig}
 *        methodConfig={methodConfig}
 *        framework={framework}
 *     />
 *   )
 * }
 *
 * renderMethodGenerator();
 */
export function MethodGenerator({
  language,
  methodName,
  methodParams = [],
  methodDocs = '',
  methodLogic = '',
  preExecutionCode = '',
  postExecutionCode = '',
  indent = 2,
  newLines = 1,
  customMethodConfig,
  methodConfig,
  framework
}: MethodGeneratorProps): JSX.Element {
  const supportedLanguages = Object.keys(defaultMethodConfig);
  
  if (!supportedLanguages.includes(language)) {
    throw unsupportedLanguage(language, supportedLanguages);
  }

  if (typeof methodName !== 'string') {
    throw invalidMethodName();
  }

  if (indent < 0) {
    throw negativeIndent(indent);
  }

  if (newLines < 0) {
    throw invalidNewLines(newLines);
  }

  if (!Array.isArray(methodParams)) {
    throw invalidMethodParams(methodParams);
  }

  const { docs: resolvedMethodDocs, logic: resolvedMethodLogic } = resolveDocsAndLogic({
    language,
    methodDocs,
    methodLogic,
    methodConfig,
    framework
  });

  const {
    returnType = '',
    openingTag = '',
    closingTag = '',
    indentSize = 2,
    parameterWrap = true
  } = customMethodConfig || defaultMethodConfig[language as Language];

  const params = methodParams.join(', ');
  const parameterBlock = parameterWrap ? `(${params})` : `${params}`;

  const indentedLogic = buildIndentedLogic(
    resolvedMethodLogic,
    preExecutionCode,
    postExecutionCode,
    indentSize
  );

  const methodCode = `${resolvedMethodDocs}
${returnType} ${methodName}${parameterBlock} ${openingTag}
${indentedLogic}
${closingTag}`;

  return (
    <Text indent={indent} newLines={newLines}>
      {methodCode}
    </Text>
  );
}