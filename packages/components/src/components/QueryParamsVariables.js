import { Text } from '@asyncapi/generator-react-sdk';
import { toCamelCase } from '@asyncapi/generator-helpers';

/**
 * @typedef {'python' | 'java'} SupportedLanguage
 * Supported programming languages for query parameter generation.
 */

/**
 * @typedef {Object} QueryParamCodeBlock
 * @property {{ text: string, indent?: number, newLines?: number }} variableDefinition - Code block for variable initialization.
 * @property {{ text: string, indent?: number, newLines?: number }} ifCondition - Conditional statement block.
 * @property {{ text: string, indent?: number, newLines?: number }} assignment - Code block assigning query param.
 * @property {{ text: string, indent?: number, newLines?: number } | null} [closing] - Optional closing block (for braces, etc.).
 */

/**
 * Language and framework specific logic for generating query parameter code.
 * Each entry returns a {@link QueryParamCodeBlock}.
 *
 * @type {Record<SupportedLanguage, Record<string, function>|function>}
 */
const queryParamLogicConfig = {
  python: (param) => {
    const paramName = param[0];
    return {
      variableDefinition: {
        text: `${paramName} = ${paramName} or os.getenv("${paramName.toUpperCase()}")`,
        indent: 8,
      },
      ifCondition: {
        text: `if ${paramName} is not None:`,
        indent: 8,
      },
      assignment: {
        text: `params["${paramName}"] = ${paramName}`,
        indent: 10,
      },
      closing: null,
    };
  },

  java: {
    quarkus: (param) => {
      const paramName = toCamelCase(param[0]);
      return {
        variableDefinition: {
          text: `this.${paramName} = (${paramName} != null && !${paramName}.isEmpty()) ? ${paramName} : System.getenv("${paramName.toUpperCase()}");`,
          indent: 6,
        },
        ifCondition: {
          text: `if (this.${paramName} != null){`,
          indent: 6,
        },
        assignment: {
          text: `params.put("${paramName}", this.${paramName});`,
          indent: 8,
        },
        closing: {
          text: '}',
          indent: 6,
          newLines: 1,
        },
      };
    },
  },
};

/**
 * Resolve the appropriate query parameter configuration function based on language and framework.
 *
 * @param {SupportedLanguage} language - The target programming language.
 * @param {string} [framework=''] - Optional framework (e.g., 'quarkus' for Java).
 * @returns {function} The configuration function for generating query parameter code.
 */
function resolveQueryParamLogic(language, framework = '') {
  const config = queryParamLogicConfig[language];
  if (typeof config === 'function') {
    return config;
  }
  if (framework && config[framework]) {
    return config[framework];
  }
}

/**
 * Component for rendering query parameter variables code.
 *
 * @param {Object} props - Component props.
 * @param {SupportedLanguage} props.language - The target programming language.
 * @param {string} [props.framework=''] - Optional framework for the language.
 * @param {string[][]} props.queryParams - Array of query parameters, each represented as [paramName, paramType?].
 */
export function QueryParamsVariables({ language, framework = '', queryParams }) {
  if (!queryParams || !Array.isArray(queryParams)) {
    return null;
  }

  const generateParamCode = resolveQueryParamLogic(language, framework);

  return queryParams.map((param) => {
    const { variableDefinition, ifCondition, assignment, closing } = generateParamCode(param);

    return (
      <>
        <Text indent={variableDefinition.indent} newLines={variableDefinition.newLines}>
          {variableDefinition.text}
        </Text>
        <Text indent={ifCondition.indent} newLines={ifCondition.newLines}>
          {ifCondition.text}
        </Text>
        <Text indent={assignment.indent} newLines={assignment.newLines}>
          {assignment.text}
        </Text>
        {closing && (
          <Text indent={closing.indent} newLines={closing.newLines}>
            {closing.text}
          </Text>
        )}
      </>
    );
  });
}
