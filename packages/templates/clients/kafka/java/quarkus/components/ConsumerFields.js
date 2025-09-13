import { Text } from '@asyncapi/generator-react-sdk';

export function ConsumerFields({ clientName }) {
  return (
    <Text indent={2} newLines={2}>
      {`private static final Logger logger = Logger.getLogger(${clientName}.class);`}
    </Text>
  );
}
