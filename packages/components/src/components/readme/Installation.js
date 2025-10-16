import { Text } from '@asyncapi/generator-react-sdk';

export function Installation() {
  return (
    <Text newLines={2}>
      {`## Installation

Install dependencies:

\`\`\`bash
pip install -r requirements.txt
\`\`\`
`}
    </Text>
  );
}
