import { toCamelCase } from '@asyncapi/generator-helpers';
import { Text } from '@asyncapi/generator-react-sdk';

export function ConstructorSignature({ clientName, queryParams }) {
  if (!queryParams) {
    return;
  }
  
  const queryParamsArguments = queryParams?.map((param) => {
    const paramName = toCamelCase(param[0]);
    return `String ${paramName}`;      // assuming the default values of the parameters are strings
  }).join(', ');
  
  return (
    <Text indent={2}>
      {`public ${clientName}(${queryParamsArguments}){`}
    </Text>
  );
}