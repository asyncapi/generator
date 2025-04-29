import { Text } from '@asyncapi/generator-react-sdk';

export function FileHeaderInfo({ info, server, language }) {
  let commentChar;
  let line;

  // Decide comment style based on language
  if (language === 'python') {
    commentChar = '#';
    line = commentChar + ' ' + '/'.repeat(70);
  } else {
    commentChar = '//';
    line = commentChar + '/'.repeat(70);
  }

  return (
    <Text>
      <Text>{line}</Text>

      <Text>{commentChar}</Text>

      <Text>
        {commentChar} {info.title?.() || 'No title specified'} - {info.version?.() || 'No version specified'}
      </Text>

      <Text>
        {commentChar} Protocol: {server.protocol?.() || 'Not specified'}
      </Text>

      <Text>
        {commentChar} Host: {server.host?.() || 'Not specified'}
      </Text>

      {server.hasPathname?.() && (
        <Text>
          {commentChar} Path: {server.pathname?.() || 'Not specified'}
        </Text>
      )}

      <Text>{commentChar}</Text>

      <Text>{line}</Text>
    </Text>
  );
}
