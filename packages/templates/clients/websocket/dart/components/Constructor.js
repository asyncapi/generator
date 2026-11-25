import { Text } from '@asyncapi/generator-react-sdk';

// Why: Dart treats `$` as string interpolation even inside double-quoted
// strings, so escape it after JSON serialization to keep the URL literal.
const escapeDartString = (value) =>
  JSON.stringify(String(value)).replace(/\$/g, '\\$');

export function Constructor({ clientName, serverUrl }) {
  const escapedServerUrl = escapeDartString(serverUrl);

  return (
    <Text newLines={2} indent={2}>
      {
        `
/// Constructor to initialize the WebSocket client
/// 
/// [url] - The WebSocket server URL. Use it if the server URL is different from the default one taken from the AsyncAPI document.
${clientName}({String? url})
  : _url = url ?? ${escapedServerUrl};
`}
    </Text>
  );
}
