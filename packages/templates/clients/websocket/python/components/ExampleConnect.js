import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleConnect({ instanceName }) {
  return (
    <Text indent={8}>
      {`${instanceName}.connect()`}
    </Text>
  );
}
