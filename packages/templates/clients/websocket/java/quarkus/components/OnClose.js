import { Text } from '@asyncapi/generator-react-sdk';


export default function OnClose({ title }) {
 
  return (
<Text newLines={1}>
{`
  @OnClose
  public void onClose() {
      Log.info("Websocket connection diconnected from " + "${title}");
  }
}

`}
</Text>
  );
}


/**
 * 
 * Old
 * 
 *  if (!operation || operation.length === 0) {
    return null;

    if(session != null && session.isOpen()) {
      String closingMessage = session.getPathParameters().get("${pathName}");
      // connection.broadcast().sendTextAndAwait(closingMessage);
      session.close();
  }
 */