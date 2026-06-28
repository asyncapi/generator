import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleImports({ clientName, clientFileName }) {
  const moduleName = clientFileName.replace('.js', '');
  return (
    <Text newLines={2}>
      {`const ${clientName} = require('./${moduleName}');`}
    </Text>
  );
}
