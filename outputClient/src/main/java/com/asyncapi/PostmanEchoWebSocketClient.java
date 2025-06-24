//////////////////////////////////////////////////////////////////////
///
/// Postman Echo WebSocket Client - 1.0.0
/// Protocol: wss
/// Host: ws.postman-echo.com
/// Path: /raw
///
//////////////////////////////////////////////////////////////////////


package com.asyncapi;

import io.quarkus.websockets.next.WebSocketClient;
import io.quarkus.websockets.next.WebSocketClientConnection;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.OnClose;
import io.quarkus.websockets.next.OnTextMessage;
import jakarta.inject.Inject;
import io.quarkus.logging.Log;

@WebSocketClient(path = "/raw")  
public class PostmanEchoWebSocketClient{

  @Inject
  WebSocketClientConnection connection;

  @OnOpen
  public void onOpen() {
      String broadcastMessage = "Echo called from Postman Echo WebSocket Client server";
      Log.info("Connected to Postman Echo WebSocket Client server");
      Log.info(broadcastMessage);
  }

  @OnTextMessage
  public void onTextMessage(String message, WebSocketClientConnection connection) {
      Log.info("Received text message: " + message);
  
  }

  public void onError(Throwable throwable) {
      Log.error("Websocket connection error: " + throwable.getMessage());
  }



  @OnClose
  public void onClose() {
      Log.info("Websocket connection diconnected from " + "Postman Echo WebSocket Client");
  }
}



