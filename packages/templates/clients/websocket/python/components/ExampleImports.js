import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleImports({ clientName, clientFileName, needsTime }) {
  const moduleName = clientFileName.replace('.py', '');
  const lines = [];
  if (needsTime) {
    lines.push('import time');
  }
  lines.push(`from ${moduleName} import ${clientName}`);
  return (
    <Text newLines={2}>
      {lines.join('\n')}
    </Text>
  );
}
