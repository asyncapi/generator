import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage } from '../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript'} Language
 * Supported programming languages.
 */

const installCommands = {
  python: 'pip install -r requirements.txt',
  javascript: 'npm install',
};

/**
 * Renders the Installation Command for a given language.
 * @param {Object} props - Component props 
 * @param {Language} props.language - The programming language for which to generate Installation Command.
 * @returns {JSX.Element} A Text component that contains Installation Command.
 * @throws {Error} When the specified language is not supported.
 * 
 * @example
 * import { Installation } from "@asyncapi/generator-components";
 * const language = "javascript";
 * 
 * function renderInstallation() {
 *   return (
 *     <Installation language={language} />
 *   )
 * }
 * 
 * renderInstallation()
 */

export function Installation({ language }) {
  const supportedLanguages = Object.keys(installCommands);
  const command = installCommands[language];
    
  if (!command) {
    throw unsupportedLanguage(language, supportedLanguages);
  }

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
