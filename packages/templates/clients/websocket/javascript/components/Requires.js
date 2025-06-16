import { Text } from '@asyncapi/generator-react-sdk';

export function Requires({ sendOperations }) {
  const schemaNames = sendOperations.map(op => `${op.id()}Schemas`);

  return (
    <Text>
      <Text>
        const WebSocket = require('ws');
      </Text>
      <Text>
        {`const { ${schemaNames.join(', ')} } = require('./schemas.js');`}
      </Text>
    </Text>
  );
}

