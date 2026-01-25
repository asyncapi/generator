import { Text } from '@asyncapi/generator-react-sdk';
import { toCamelCase } from '@asyncapi/generator-helpers';

/**
 * @typedef {'python' | 'java' | 'javascript'} Language
 * Supported programming languages for query parameter generation.
 */

/**
 * @typedef {Object} QueryParamCodeBlock
 * @property {{ text: string, indent: number | undefined, newLines: number | undefined }} variableDefinition - Code block for variable initialization.
 * @property {{ text: string, indent: number | undefined, newLines: number | undefined }} ifCondition - Conditional statement block.
 * @property {{ text: string, indent: number | undefined, newLines: number | undefined }} assignment - Code block assigning query param.
 * @property {{ text: string, indent: number | undefined, newLines: number | undefined } | null} [closing] - Optional closing block (for braces, etc.).
 */

/**
 * Language and framework specific logic for generating query parameter code.
 * Each entry returns a {@link QueryParamCodeBlock}.
 *
 * @type {Record<Language, Record<string, function>|function>}
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
  javascript: (param) => {
    const paramName = param[0];
    return {
      variableDefinition: {
        text: `const ${paramName} = ${paramName} || process.env.${paramName.toUpperCase()};`,
        indent: 8,
      },
      ifCondition: {
        text: `if (${paramName}) {`,
        indent: 8,
      },
      assignment: {
        text: `params["${paramName}"] = ${paramName};`,
        indent: 10,
      },
      closing: {
        text: '}',
        indent: 8,
        newLines: 1,
      },
    };
  },
};

/**
 * Resolve the appropriate query parameter configuration function based on language and framework.
 *
 * @private
 * @param {Language} language - The target programming language.
 * @param {string} [framework=''] - Optional framework (e.g., 'quarkus' for Java).
 * @returns {function | undefined} The configuration function for generating query parameter code.
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
 * @param {Language} props.language - The target programming language.
 * @param {string} [props.framework=''] - Optional framework for the language.
 * @param {string[][]} props.queryParams - Array of query parameters, each represented as [paramName, paramType?].
 * @returns {React.ReactNode[]|null} Array of Text components for each query parameter, or null if queryParams is invalid.
 * 
 * @example
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * import { getQueryParams } from "@asyncapi/generator-helpers";
 * import { QueryParamsVariables } from "@asyncapi/generator-components";
 * 

 * async function renderQueryParamsVariable(){
 *    const parser = new Parser();
 *    const asyncapi_v3_path = path.resolve(__dirname, "../__fixtures__/asyncapi-v3.yml");
 *    
 *    // Parse the AsyncAPI document
 *    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
 *    const parsedAsyncAPIDocument = parseResult.document;
 *    
 *    const channels = parsedAsyncAPIDocument.channels();
 *    const queryParamsObject = getQueryParams(channels);
 *    const queryParamsArray = queryParamsObject ? Array.from(queryParamsObject.entries()) : [];
 *    
 *    const language = "java";
 *    const framework = "quarkus";
 *    
 *    return (
 *      <QueryParamsVariables 
 *          language={language} 
 *          framework={framework}   
 *          queryParams={queryParamsArray} 
 *      />
 *    )
 * }
 * 
 * renderQueryParamsVariable().catch(console.error);
 */
export function QueryParamsVariables({ language, framework = '', queryParams }) {
  if (!queryParams || !Array.isArray(queryParams)) {
    return null;
  }

  const generateParamCode = resolveQueryParamLogic(language, framework);
  if (!generateParamCode) {
    return null;
  }

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