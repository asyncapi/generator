import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleClose({ instanceName }) {
  return (
    <Text indent={8}>
      {`${instanceName}.close()`}
    </Text>
  );
}
