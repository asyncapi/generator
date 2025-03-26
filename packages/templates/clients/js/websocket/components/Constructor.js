import { Text } from '@asyncapi/generator-react-sdk';

export function Constructor({ serverUrl }) {
  return (
    <Text indent={2}>
      {
        `constructor() {
  this.url = '${serverUrl}';
  this.websocket = null;
  this.messageHandlers = [];
  this.errorHandlers = [];
}
`
      }
    </Text>
  );
}
