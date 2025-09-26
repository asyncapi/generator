import { Text } from '@asyncapi/generator-react-sdk';
import OperationHeader from './OperationHeader';
import MessageExamples from './MessageExamples';

export function AvailableOperations({ operations }) {
  if (!operations || operations.length === 0) {
    return null;
  }
  return (
    <>
      <Text newLines={2}>### Available Operations</Text>
      {operations.map((operation, index) => (
        <Text key={index} newLines={2}>
          <OperationHeader operation={operation} />
          <MessageExamples operation={operation} />
        </Text>
      ))}
    </>
  );
}
