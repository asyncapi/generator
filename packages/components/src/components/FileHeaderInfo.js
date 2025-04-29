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
      {commentChar} {info.title?.() || 'Untitled'} - {info.version?.() || 'No version'}
      </Text>

      <Text>
      {commentChar} Protocol: {server.protocol?.() || 'Unknown'}
      </Text>

      <Text>
      {commentChar} Host: {server.host?.() || 'Unknown'}
      </Text>

      +  {server.hasPathname?.() && (
        <Text>
           {commentChar} Path: {server.pathname?.() || ''}
        </Text>
      )}

      <Text>{commentChar}</Text>

      <Text>{line}</Text>
    </Text>
  );
}
