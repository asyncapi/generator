import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {'python' | 'javascript' | 'typescript' | 'java' | 'csharp' | 'rust' | 'dart'} Language
 * Supported programming languages.
 */

/**
 * Mapping of language to comment styles.
 * @type {Record<Language, string>}
 */
const commentStyles = {
  python: '#',
  javascript: '//',
  typescript: '//',
  java: '//',
  csharp: '//',
  rust: '//',
  dart: '///'
};

/**
 * Renders a file header with metadata information such as title, version, protocol, host, and path.
 *
 * @param {Object} props - Component props.
 * @param {object} props.info - Info object from the AsyncAPI document.
 * @param {object} props.server - Server object from the AsyncAPI document.
 * @param {Language} props.language - Programming language used for comment formatting.
 * @returns {JSX.Element} Rendered file header.
 */
export function FileHeaderInfo({ info, server, language }) {
  const commentChar = commentStyles[language] || '//';
  const line = `${commentChar}${'/'.repeat(70)}`;

  return (
    <Text>
      <Text>{line}</Text>

      <Text>{commentChar}</Text>

      <Text>
        {commentChar} {info.title()} - {info.version()}
      </Text>

      <Text>
        {commentChar} Protocol: {server.protocol()}
      </Text>

      <Text>
        {commentChar} Host: {server.host()}
      </Text>

      {server.hasPathname() && (
        <Text>
          {commentChar} Path: {server.pathname()}
        </Text>
      )}

      <Text>{commentChar}</Text>

      <Text>{line}</Text>
    </Text>
  );
}