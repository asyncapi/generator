import { Text } from '@asyncapi/generator-react-sdk';

export function Constructor ({ serverName }) {
  return (
    <Text>
        {
          `  constructor() {
    this.url = '${serverName}';
    this.websocket = null;
    this.messageHandlers = [];
    this.errorHandlers = [];
  }
`
        }
    </Text>
  );
}
