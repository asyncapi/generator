import { ClientFields } from "./ClientFields.js";
import HandleError from "./HandleError.js";
import OnClose from "./OnClose.js";
import OnOpen from "./OnOpen.js";
import OnTextMessageHandler from "./OnTextMessageHandler.js";
import { Text } from '@asyncapi/generator-react-sdk';


export function EchoWebSocket({ clientName, pathName, title, operations }) {
  const sendOperations = operations.filterBySend();
  // console.log("DEBUG SERver URL echo:\n", serverUrl);
  return (
    <Text>
      <Text newLines={2}>
        {`@WebSocketClient(path = "${pathName}")  
public class ${clientName}{`}
      </Text>
      <ClientFields />
      <OnOpen title={title}/>
      <OnTextMessageHandler />
      <HandleError/>
      <OnClose title={title} />
    </Text>
  );
}


/**
 * old
 * <Constructor serverUrl={serverUrl} query={queryParams} />
      <Connect title={title} />
      <RegisterMessageHandler />
      <RegisterErrorHandler />
      <RegisterOutgoingProcessor />
      <HandleMessage />
      <HandleError />
      <SendOperation sendOperations={sendOperations} clientName={clientName} />
      <Send sendOperations={sendOperations} />
      <CloseConnection />
 */