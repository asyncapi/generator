import { ClientFields } from "./ClientFields.js";
import HandleError from "./HandleError.js";
import OnClose from "./OnClose.js";
import OnOpen from "./OnOpen.js";
import OnTextMessageHandler from "./OnTextMessageHandler.js";
import { Text } from '@asyncapi/generator-react-sdk';


export function EchoWebSocket({ clientName, pathName, title, operations }) {
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