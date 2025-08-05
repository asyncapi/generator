import { toCamelCase } from '@asyncapi/generator-helpers/src/utils';
import { Text } from '@asyncapi/generator-react-sdk';

export function DefaultConstructorSignature({ clientName, queryParams }) {
  if (!queryParams) {
    return
  }

  var argDefaultValues = []
  
  const queryParamsArguments = queryParams?.map((param) => {
    const paramName = toCamelCase(param[0]);
    const paramDefaultValue = param[1];
    const defaultValue = paramDefaultValue ? `"${paramDefaultValue}"` : 'null';
    argDefaultValues.push(defaultValue);
    return `String ${paramName}`;      
  }).join(', ');
  
  return (
    <Text indent={2} newLines={2}>
      {`public ${clientName}(){
    this(${argDefaultValues.join(', ')});
}`}
    </Text>
  );
}