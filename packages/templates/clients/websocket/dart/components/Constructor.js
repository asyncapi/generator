import { Text } from '@asyncapi/generator-react-sdk';

export function Constructor({ clientName, serverUrl }) {
  return (
    <Text newLines={2} indent={2}>
      {
        `
/// Constructor to initialize the WebSocket client
/// 
/// [url] - The WebSocket server URL. Use it if the server URL is different from the default one taken from the AsyncAPI document.
${clientName}({String? url})
  : _url = url ?? '${serverUrl}';
`}
    </Text>
  );
}
