import { Text } from '@asyncapi/generator-react-sdk';
import MessageExamples from './MessageExamples';
import OperationHeader from './OperationHeader';

export function AvailableOperations({ operations }) {
  return (
    <>
      <Text newLines={2}>### Available Operations</Text>
      {operations.length > 0 ? (
        operations.map((operation) => (
          <Text newLines={2}>
            <OperationHeader operation={operation} />
            <MessageExamples operation={operation} />
          </Text>
        ))
      ) : (
        <Text newLines={2}>
          {`#### \`sendEchoMessage(payload)\`  
          Sends a message to the server that will be echoed back.  
          **Example:**  
          \`\`\`javascript
          client.sendEchoMessage({ message: "Hello World" });
          \`\`\`
          `}
        </Text>
      )}
    </>
  );
}
