import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {'python' | 'javascript' | 'dart' | 'java'} Language
 * Supported programming languages.
 */

/**
 * Configuration for method syntax based on programming language.
 * @type {Record<Language, { returnType: string | undefined, openingTag: string | undefined, closingTag: string | undefined, indentSize: number | undefined }>}
 */
const defaultMethodConfig = {
  python: { returnType: 'def', openingTag: ':', indentSize: 2, parameterWrap: true },
  javascript: { openingTag: '{', closingTag: '}', indentSize: 2, parameterWrap: true },
  dart: { returnType: 'void', openingTag: '{', closingTag: '}', indentSize: 2, parameterWrap: true },
  java: { returnType: '', openingTag: '', closingTag: '', indentSize: 0, parameterWrap: false }
};

/**
 * Resolve docs and logic for the given language + framework config.
 * 
 * @private
 * @param {Object} params
 * @param {Language} params.language
 * @param {string} [params.methodDocs]
 * @param {string} [params.methodLogic]
 * @param {Record<Language, { methodDocs: string | undefined, methodLogic: string | undefined } | Record<string, { methodDocs: string | undefined, methodLogic: string | undefined }>>} [params.methodConfig]
 * @param {string} [params.framework]
 * @returns {{ docs: string, logic: string }}
 */
const resolveDocsAndLogic = ({ language, methodDocs, methodLogic, methodConfig, framework }) => {
  let docs = methodDocs;
  let logic = methodLogic;

  if (methodConfig && methodConfig[language]) {
    const config = methodConfig[language];

    if (framework && config[framework]) {
      const frameworkConfig = config[framework];
      docs = frameworkConfig.methodDocs ?? methodDocs ?? '';
      logic = frameworkConfig.methodLogic ?? methodLogic ?? '';
    } else if (config.methodLogic || config.methodDocs) {
      docs = config.methodDocs ?? methodDocs ?? '';
      logic = config.methodLogic ?? methodLogic ?? '';
    }
  }

  return { docs, logic };
};

/**
 * Build indented method body.
 * 
 * @private
 * @param {string} logic
 * @param {string} [preExecutionCode]
 * @param {string} [postExecutionCode]
 * @param {number} indentSize
 * @returns {string}
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
 * Renders a language-specific formatted method definition.
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
 * @param {{ returnType: string | undefined, openingTag: string | undefined, closingTag: string | undefined, indentSize: number | undefined, parameterWrap: boolean | undefined }} [props.customMethodConfig]  - Optional custom syntax configuration for the current language.
 * @param {Record<Language, { methodDocs: string | undefined, methodLogic: string | undefined } | Record<string, { methodDocs: string | undefined, methodLogic: string | undefined }>>} [props.methodConfig] - Language-level or framework-level configuration.
 * @param {string} [props.framework] - Framework name for nested configurations (e.g., 'quarkus' for Java).
 * @returns {JSX.Element} A Text component that contains method block with appropriate formatting.
 * 
 * @example
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
}) {
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