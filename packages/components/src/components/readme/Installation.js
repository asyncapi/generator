import { Text } from '@asyncapi/generator-react-sdk';

const installCommands = {
  python: 'pip install -r requirements.txt',
  javascript: 'npm install',
};

/**
 * Renders the Installation Command for a given language.
 * @param {Object} props - Component Props 
 * @param {string} props.language - The programming language for which to generate Installation Command.
 * @returns {JSX.Element} A Text Component that contains Installation Command.
 * 
 * @example
 * const language = "javascript";
 * return (
 *   <Installation language={language} />
 * )
 */

export function Installation({ language }) {
  const command = installCommands[language];
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
