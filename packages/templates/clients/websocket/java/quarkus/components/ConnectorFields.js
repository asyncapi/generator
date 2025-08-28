import { Text } from '@asyncapi/generator-react-sdk';

export function ConnectorFields({ clientName, queryParamsArray }) {
  return (
    <Text indent={2} newLines={1}>
      {`@Inject
WebSocketConnector<${clientName}> connector;

${ queryParamsArray && queryParamsArray.length ? `
@Inject
@ConfigProperty(name = "com.asyncapi.${clientName}.base-uri")
String baseURI;` : ''}
`}
    </Text>
  );
}
