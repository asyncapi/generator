import { Text } from '@asyncapi/generator-react-sdk';
import { QueryParamsVariables } from '@asyncapi/generator-components';
import { toCamelCase } from '@asyncapi/generator-helpers';

export function Constructor({ clientName, serverUrl, query }) {
  const queryParamsArray = query && Array.from(query.entries());

  if (!queryParamsArray || queryParamsArray.length === 0) {
    return (
      <Text newLines={2} indent={2}>
        {`
/// Constructor to initialize the WebSocket client
/// 
/// [url] - The WebSocket server URL. Use it if the server URL is different from the default one taken from the AsyncAPI document.
${clientName}({String? url})
  : _url = url ?? '${serverUrl}';
`}
      </Text>
    );
  }

  const queryParamsSignature = queryParamsArray.map((param) => {
    const paramName = toCamelCase(param[0]);
    const paramDefaultValue = param[1];
    const defaultValue = paramDefaultValue !== null
      ? `'${String(paramDefaultValue).replace(/'/g, '\\\'')}'`
      : 'null';
    return `String? ${paramName} = ${defaultValue}`;
  }).join(', ');

  const queryParamsDocs = queryParamsArray.map((param) => {
    const paramName = toCamelCase(param[0]);
    return `/// [${paramName}] - If provided (or if ${param[0].toUpperCase()} environment variable is set), added as ?${param[0]}=… to URL`;
  }).join('\n');

  return (
    <>
      <Text indent={2} newLines={2}>
        {`
/// Constructor to initialize the WebSocket client
/// 
/// [url] - The WebSocket server URL. Use it if the server URL is different from the default one taken from the AsyncAPI document.
${queryParamsDocs}
${clientName}({String? url, ${queryParamsSignature}}) {
    _url = url ?? '${serverUrl}';
    final params = <String, String>{};`}
      </Text>
      <QueryParamsVariables
        language="dart"
        queryParams={queryParamsArray}
      />
      <Text indent={6} newLines={2}>
        {`if (params.isNotEmpty) {
        final qs = params.entries.map((e) => '\${Uri.encodeComponent(e.key)}=\${Uri.encodeComponent(e.value)}').join('&');
        _url = '\${_url}\${_url.contains('?') ? '&' : '?'}\$qs';
      }`}
      </Text>
      <Text indent={2}>
        {'}'}
      </Text>
    </>
  );
}
