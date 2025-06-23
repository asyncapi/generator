import { Text } from "@asyncapi/generator-react-sdk";
import InitConnector from "./InitConnector";
import { ConnectorFields } from "./ConnectorFields";

export default function ClientConnector({clientName, serverBaseURI}) {
    return (
        <Text newLines={2} indent={2}>
            <Text newLines={2}>
        {`@Startup
@Singleton  
public class ${clientName}Connector{`}
            </Text>
            <ConnectorFields clientName={clientName} />
            <InitConnector serverURI={serverBaseURI} />
        </Text>

    );

}