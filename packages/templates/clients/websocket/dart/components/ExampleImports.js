import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleImports({ clientFileName }) {
  return (
    <Text newLines={2}>
      {`import 'dart:async';
import '${clientFileName}';`}
    </Text>
  );
}
