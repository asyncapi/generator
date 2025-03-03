import { Text } from '@asyncapi/generator-react-sdk';

export function ClassDeclaration({ clientName, serverUrl }) {
  return (
    <Text>
      {`class ${clientName} {
  constructor() {
    this.url = '${serverUrl}';
    this.websocket = null;
    this.messageHandlers = [];
    this.errorHandlers = [];
  }`}
    </Text>
  );
}