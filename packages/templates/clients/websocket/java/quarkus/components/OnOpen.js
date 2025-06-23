import { Text } from '@asyncapi/generator-react-sdk';

export default function OnOpen({ title }) {
  return (
<Text newLines={1} indent={2}>
{`
@OnOpen
public void onOpen() {
    String broadcastMessage = "Echo called from ${title} server";
    Log.info("Connected to ${title} server");
    Log.info(broadcastMessage);
}
`}
</Text>
  );
}


/**
 *  // Get lightId from the URL path parameter
    String user = session.getPathParameters().get("username");

    // Log the new connection
    System.out.println("New connection opened" + user);

    // Send a welcome message to the client
    String welcomeMessage = "Welcome to the control panel";
    connection.sendText(welcomeMessage);  // Send to the specific client



    if(session != null){
      Log.info("Already connected to ${title} server");
      return;
    }
    this.session = session;
 */