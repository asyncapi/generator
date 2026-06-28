import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleClose({ instanceName }) {
  return (
    <Text indent={4}>
      {`await ${instanceName}.close();`}
    </Text>
  );
}
