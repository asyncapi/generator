package com.asyncapi;

import io.quarkus.websockets.next.WebSocketClient;
import jakarta.enterprise.context.ApplicationScoped;
import com.asyncapi.HoppscotchEchoWebSocketClient;


@WebSocketClient(path = "/")
@ApplicationScoped
public class HoppscotchSendWrapper extends HoppscotchEchoWebSocketClient {

}
