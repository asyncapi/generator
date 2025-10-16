import { Text } from '@asyncapi/generator-react-sdk';

export function Overview({ info, title, serverUrl }) {
  return (
    <Text newLines={2}>
      {`## Overview

${info.description() || `A WebSocket client for ${title}.`}

- **Version:** ${info.version()}
- **Server URL:** ${serverUrl}
`}
    </Text>
  );
}

