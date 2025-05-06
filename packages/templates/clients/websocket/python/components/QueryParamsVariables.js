import { Text } from '@asyncapi/generator-react-sdk';

export function QueryParamsVariables({ queryParams }) {
  if (!queryParams) {
    return null;
  }

  return queryParams.map((param) => {
    const paramName = param[0];
    const variableDefinition = `${paramName} = ${paramName} or os.getenv("${paramName.toUpperCase()}")`;
    const ifQueryProvided = `if ${paramName} is not None:`;
    const assignment = `params["${paramName}"] = ${paramName}`;
    return (
      <>
        <Text indent={8}>
          {variableDefinition}
        </Text>
        <Text indent={8}>
          {ifQueryProvided}
        </Text>
        <Text indent={10}>
          {assignment}
        </Text>
      </>
    );
  });
}
