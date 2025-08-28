import { Text } from '@asyncapi/generator-react-sdk';

export function DefaultConstructorSignature({ clientName, queryParams }) {
  if (!queryParams || !Array.isArray(queryParams)) {
    return null;
  }

  const argDefaultValues = [];
  
  queryParams.forEach((param) => {
    const paramDefaultValue = param[1];
    const defaultValue = paramDefaultValue ? `"${paramDefaultValue}"` : 'null';
    argDefaultValues.push(defaultValue);      
  });
  
  return (
    <Text indent={2} newLines={2}>
      {`public ${clientName}(){
    this(${argDefaultValues.join(', ')});
}`}
    </Text>
  );
}