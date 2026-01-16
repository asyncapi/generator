import { Text } from '@asyncapi/generator-react-sdk';
import { resolveLanguageConfig } from '../utils/resolveLanguageConfig';

/**
 * @typedef {'python' | 'javascript' | 'dart' | 'java'} Language
 * Supported programming languages.
 */

/**
 * Configuration for method syntax based on programming language.
 * @type {Record<Language, { returnType?: string, openingTag?: string, closingTag?: string, indentSize?: number }>}
 */
const defaultMethodConfig = {
  python: { returnType: 'def', openingTag: ':', indentSize: 2, parameterWrap: true },
  javascript: { openingTag: '{', closingTag: '}', indentSize: 2, parameterWrap: true },
  dart: { returnType: 'void', openingTag: '{', closingTag: '}', indentSize: 2, parameterWrap: true },
  java: { returnType: '', openingTag: '', closingTag: '', indentSize: 0, parameterWrap: false }
};


/**
 * Build indented method body.
 */
const buildIndentedLogic = (logic, preExecutionCode, postExecutionCode, indentSize) => {
  let completeCode = logic;
  if (preExecutionCode) completeCode = `${preExecutionCode}\n${completeCode}`;
  if (postExecutionCode) completeCode = `${completeCode}\n${postExecutionCode}`;

  const innerIndent = ' '.repeat(indentSize);
  return completeCode
    .split('\n')
    .map(line => (line ? `${innerIndent}${line}` : ''))
    .join('\n');
};

/**
 * Generic Method rendering component.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Programming language used for method formatting.
 * @param {string} props.methodName - Name of the method.
 * @param {string[]} [props.methodParams=[]] - Method parameters.
 * @param {string} [props.methodDocs=''] - Optional documentation string.
 * @param {string} [props.methodLogic=''] - Core method logic.
 * @param {string} [props.preExecutionCode=''] - Code before main logic.
 * @param {string} [props.postExecutionCode=''] - Code after main logic.
 * @param {number} [props.indent=2] - Indentation for the method block.
 * @param {number} [props.newLines=1] - Number of new lines after method.
 * @param {{ returnType?: string, openingTag?: string, closingTag?: string, indentSize?: number, parameterWrap?: boolean }} [props.customMethodConfig]  - Optional custom syntax configuration for the current language.
 * @param {Record<Language, ({ methodDocs?: string, methodLogic?: string } | Record<string, { methodDocs?: string, methodLogic?: string }>)} [props.methodConfig] - Language-level or framework-level configuration.
 * @param {string} [props.framework] - Framework name for nested configurations (e.g., 'quarkus' for Java).
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
}) {

  
/**
 * Resolve docs and logic for the given language + framework config.
 */
let resolvedMethodDocs = methodDocs;
let resolvedMethodLogic = methodLogic; 

if (methodConfig) {
  const resolvedConfig = resolveLanguageConfig({
    config: methodConfig,
    language,
    framework,
    context: `method "${methodName}"`
  });

  resolvedMethodDocs = resolvedConfig.methodDocs ?? methodDocs;
  resolvedMethodLogic = resolvedConfig.methodLogic ?? methodLogic;
}


  const {
    returnType = '',
    openingTag = '',
    closingTag = '',
    indentSize = 2,
    parameterWrap = true
  } = customMethodConfig || defaultMethodConfig[language];

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