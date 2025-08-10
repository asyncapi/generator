import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages.
 */

/**
 * Configuration for method syntax based on programming language.
 * @type {Record<Language, { returnType?: string, openingTag?: string, closingTag?: string, indentSize?: number }>}
 */
const defaultMethodConfig = {
  python: { returnType: 'def', openingTag: ':', indentSize: 2 },
  javascript: { openingTag: '{', closingTag: '}', indentSize: 2 },
  dart: { returnType: 'void', openingTag: '{', closingTag: '}', indentSize: 2 }
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
 * @param {{ returnType?: string, openingTag?: string, closingTag?: string, indentSize?: number }} [props.customMethodConfig]  - Optional custom syntax configuration for the current language.
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
  customMethodConfig
}) {
  const {
    returnType = '',
    openingTag = '',
    closingTag = '',
    indentSize = 2
  } = customMethodConfig || defaultMethodConfig[language];

  const params = methodParams.join(', ');

  let completeCode = methodLogic;

  if (preExecutionCode) {
    completeCode = `${preExecutionCode}\n${completeCode}`;
  }
  if (postExecutionCode) {
    completeCode = `${completeCode}\n${postExecutionCode}`;
  }

  const innerIndent = ' '.repeat(indentSize);
  const indentedLogic = completeCode
    .split('\n')
    .map(line => (line ? `${innerIndent}${line}` : ''))
    .join('\n');

  const methodCode = `${methodDocs}
${returnType} ${methodName}(${params}) ${openingTag}
${indentedLogic}
${closingTag}`;

  return (
    <Text indent={indent} newLines={newLines}>
      {methodCode}
    </Text>
  );
}