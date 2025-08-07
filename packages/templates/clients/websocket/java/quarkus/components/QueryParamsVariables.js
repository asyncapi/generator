import { toCamelCase } from '@asyncapi/generator-helpers/src/utils';
import { Text } from '@asyncapi/generator-react-sdk';

export function QueryParamsVariables({ queryParams }) {
  if (!queryParams || !Array.isArray(queryParams)) { 
    return null;
  }

  return queryParams.map((param) => {
    const paramName = toCamelCase(param[0]);
    const variableDefinition = `this.${paramName} = (${paramName} != null && !${paramName}.isEmpty()) ? ${paramName} : System.getenv("${paramName.toUpperCase()}");`;
    const ifQueryProvided = `if (this.${paramName} != null){`;
    const assignment = `params.put("${paramName}", this.${paramName});`;
    const closingTag = '}\n';
    return (
      <>
        <Text indent={6}>
          {variableDefinition}
        </Text>
        <Text indent={6}>
          {ifQueryProvided}
        </Text>
        <Text indent={8}>
          {assignment}
        </Text>
        <Text indent={6}>
          {closingTag}
        </Text>
      </>
    );
  });
}
