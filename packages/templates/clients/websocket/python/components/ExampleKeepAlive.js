import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleKeepAlive({ seconds = 30 }) {
  return (
    <Text indent={8}>
      {`time.sleep(${seconds})  # Increase as needed to keep the connection alive longer`}
    </Text>
  );
}
