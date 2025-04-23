import { Text } from '@asyncapi/generator-react-sdk';
import OperationHeader from './OperationHeader';
import MessageExamples from './MessageExamples';

export function AvailableOperations({ operations }) {
  return (
    <>
      <Text newLines={2}>### Available Operations</Text>
      {operations.map((operation) => (
        <Text newLines={2}>
          <OperationHeader operation={operation} />
          <MessageExamples operation={operation} />
        </Text>
      ))}
    </>
  );
}
