import { Text } from '@asyncapi/generator-react-sdk';
import { toCamelCase } from '@asyncapi/generator-helpers';
import { unsupportedLanguage } from '../utils/ErrorHandling';

type Language = 'python' | 'java' | 'javascript';

/**
 * Shape of a single query parameter code block.
 */
interface QueryParamCodeBlock {
  variableDefinition: { text: string; indent?: number; newLines?: number };
  ifCondition: { text: string; indent?: number; newLines?: number };
  assignment: { text: string; indent?: number; newLines?: number };
  closing?: { text: string; indent?: number; newLines?: number } | null;
}

type QueryParamGenerator = (param: string[]) => QueryParamCodeBlock;

/**
 * Language and framework specific logic for generating query parameter code.
 * Each entry returns a QueryParamCodeBlock.
 */
const queryParamLogicConfig: Record<string, QueryParamGenerator | Record<string, QueryParamGenerator>> = {
  python: (param: string[]): QueryParamCodeBlock => {
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
    quarkus: (param: string[]): QueryParamCodeBlock => {
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
  javascript: (param: string[]): QueryParamCodeBlock => {
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
 */
function resolveQueryParamLogic(language: string, framework: string): QueryParamGenerator | null {
  const config = queryParamLogicConfig[language];
  if (typeof config === 'function') {
    return config;
  }
  if (framework && (config as Record<string, QueryParamGenerator>)[framework]) {
    return (config as Record<string, QueryParamGenerator>)[framework];
  }
  return null;
}

interface QueryParamsVariablesProps {
  /** The target programming language. */
  language: string;
  /** Optional framework for the language. */
  framework?: string;
  /** Array of query parameters, each represented as [paramName, paramType?]. */
  queryParams: string[][];
}

/**
 * Renders query parameter variables code blocks.
 *
 * @param props - Component props.
 * @returns Array of Text components for each query parameter, or null if queryParams is invalid.
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
export function QueryParamsVariables({ language, framework = '', queryParams }: QueryParamsVariablesProps): JSX.Element[] | null {
  if (!queryParams || !Array.isArray(queryParams)) {
    return null;
  }

  const supportedLanguages = Object.keys(queryParamLogicConfig);
  if (!supportedLanguages.includes(language)) {
    throw unsupportedLanguage(language, supportedLanguages);
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