import { Text } from '@asyncapi/generator-react-sdk';

export function Requires({ query }) {
  return (
    <Text>
      <Text>
        {`import json
import certifi
import threading
import websocket
${query ? 'import os' : ''}
${query ? 'from urllib.parse import urlencode' : ''}`}
      </Text>
    </Text>
  );
}

