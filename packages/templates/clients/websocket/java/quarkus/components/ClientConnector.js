import { Text } from '@asyncapi/generator-react-sdk';
import InitConnector from './InitConnector';
import { ConnectorFields } from './ConnectorFields';

export default function ClientConnector({ clientName, query, pathName }) {
  const queryParamsArray = query && Array.from(query.entries());
  return (
    <Text newLines={2} indent={2}>
      <Text newLines={2}>
        {`
@Startup
@Singleton  
public class ${clientName}Connector{`}
      </Text>
      <ConnectorFields clientName={clientName} queryParamsArray={queryParamsArray} />
      <InitConnector queryParamsArray={queryParamsArray} pathName={pathName}/>
    </Text>
  );
}