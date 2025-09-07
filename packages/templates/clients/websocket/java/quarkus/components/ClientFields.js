import { toCamelCase } from '@asyncapi/generator-helpers';
import { Text } from '@asyncapi/generator-react-sdk';

export function ClientFields({ queryParams, clientName }) {
  let queryParamsVariables = '';
  const queryParamsArray = queryParams && Array.from(queryParams.entries());
  
  if (queryParamsArray) {
    queryParamsVariables = '\nprivate HashMap<String, String> params;\n';
    queryParamsVariables += queryParamsArray.map((param) => {
      const paramName = toCamelCase(param[0]);
      return `private String ${paramName};`;                               
    }).join('\n');
  }

  return (
    <Text indent={2} newLines={2}>
      {`@Inject
public WebSocketClientConnection connection;

private static final Logger LOG = Logger.getLogger(${clientName}.class);

${queryParamsVariables}`}
    </Text>
  );
}
