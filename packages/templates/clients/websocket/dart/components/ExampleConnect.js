import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleConnect({ instanceName }) {
  return (
    <Text indent={4} newLines={2}>
      {`await ${instanceName}.connect();`}
    </Text>
  );
}
