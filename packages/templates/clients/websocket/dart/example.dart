import 'dart:async';
import 'test/temp/snapshotTestResult/client-postman.dart';

void myHandler(String message) {
  print('====================');
  print('Just proving I got the message in myHandler: $message');
  print('====================');
}

void myErrorHandler(Object error) {
  print('Errors from WebSocket: $error');
}

Future<void> main() async {
  final wsClient = PostmanEchoWebSocketClientClient();
  wsClient.registerMessageHandler(myHandler);
  wsClient.registerErrorHandler(myErrorHandler);

  try {
    await wsClient.connect();

    const interval = Duration(seconds: 5);
    const message = 'Hello, Echo!';

    while (true) {
      try {
        wsClient.sendEchoMessage(message);
      } catch (error) {
        print('Error while sending message: $error');
      }
      await Future.delayed(interval);
    }
  } catch (error) {
    print('Failed to connect to WebSocket: $error');
  }
}
