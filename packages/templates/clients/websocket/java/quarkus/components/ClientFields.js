import { FormatHelpers } from '@asyncapi/modelina';
import { Text } from '@asyncapi/generator-react-sdk';

export function ClientFields({ queryParams }) {
  let queryParamsVariables = '';
  const queryParamsArray = queryParams && Array.from(queryParams.entries());
  
  if (queryParamsArray) {
    queryParamsVariables = '\nprivate HashMap<String, String> params;\n';
    queryParamsVariables += queryParamsArray.map((param) => {
      const paramName = FormatHelpers.toCamelCase(param[0]);
      return `private String ${paramName};`;                               
    }).join('\n');
  }

  return (
    <Text indent={2} newLines={2}>
      {`@Inject
WebSocketClientConnection connection;
${queryParamsVariables}`}
    </Text>
  );
}
