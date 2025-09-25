import { Text } from '@asyncapi/generator-react-sdk';

export function OverviewSection({ title, description, version, serverUrl }) {
  return (
    <Text newLines={2}>
      {`# ${title}

## Overview

${description || `A WebSocket client for ${title}.`}
- **Version:** ${version}
- **Server URL:** ${serverUrl}
`}
    </Text>
  );
}

