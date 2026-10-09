import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage } from '../../utils/ErrorHandling';

type Language = 'python' | 'javascript';

const installCommands: Record<Language, string> = {
  python: 'pip install -r requirements.txt',
  javascript: 'npm install',
};

interface InstallationProps {
  /** The programming language for which to generate Installation Command. */
  language: string;
}

/**
 * Renders the Installation Command for a given language.
 * @param props - Component props
 * @returns A Text component that contains Installation Command.
 * @throws When the specified language is not supported.
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

export function Installation({ language }: InstallationProps): JSX.Element {
  const supportedLanguages = Object.keys(installCommands);
  const command = installCommands[language as Language];
    
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
