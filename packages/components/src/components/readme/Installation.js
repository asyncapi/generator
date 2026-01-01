import { Text } from '@asyncapi/generator-react-sdk';

const installCommands = {
  python: 'pip install -r requirements.txt',
  javascript: 'npm install',
};

export function Installation({ language }) {
  const command = installCommands[language]
  return (
    <Text newLines={2}>
      {`## Installation

Install dependencies:

\`\`\`bash
${command}
\`\`\`
`}
    </Text>
  );
}
