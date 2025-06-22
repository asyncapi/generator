//////////////////////////////////////////////////////////////////////
///
/// Streetlights API - 1.0.0
/// Protocol: mqtt
/// Host: test.mosquitto.org
///
//////////////////////////////////////////////////////////////////////


import io.quarkus.websockets.next.OnClose;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.OnTextMessage;
import io.quarkus.websockets.next.WebSocket;
import io.quarkus.websockets.next.WebSocketConnection;
import jakarta.inject.Inject;
import jakarta.websocket.Session;


@WebSocket(path = "/chat/username")  
public class turnOnEchoWebSocket {
  @Inject
  WebSocketConnection connection;
        

  @OnTextMessage(brodcast = true)
  public String onTextMessage(turn_on input) {
    try {
      return input.sendMessage();  // can edit what gets sent later!! clientName.sendMessage("methodName}", message);
    } catch (Exception e) {
      System.err.println("Error sending: " + e.getMessage());
    }
  }

 @OnOpen
 public void onOpen(Session session) {
     // Get lightId from the URL path parameter
     String lightId = session.getPathParameters().get("username");

     // Log the new connection
     System.out.println("New connection opened");

     // Send a welcome message to the client
     String welcomeMessage = "Welcome to the control panel";
     connection.sendText(welcomeMessage);  // Send to the specific client

     // Optionally, you can broadcast a message to all clients
     String broadcastMessage = "A new user has connected";
     connection.broadcast().sendText(broadcastMessage);  // Broadcast to all
 }


  @OnClose
  public void onOpen(Session session) {
    // logic to handle closing
    String closingMessage = session.getPathParameters().get("username");
    connection.broadcast().sendTextAndAwait(closingMessage);
  }
}


