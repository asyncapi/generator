//////////////////////////////////////////////////////////////////////
///
/// Postman Echo WebSocket - 1.0.0
/// Protocol: wss
/// Host: ws.postman-echo.com
/// Path: /raw
///
//////////////////////////////////////////////////////////////////////

import 'package:web_socket_channel/web_socket_channel.dart';

class PostmanEchoWebSocketClient {

  final String _url;
  WebSocketChannel? _channel;
  final List<void Function(String)> _messageHandlers = [];
  final List<void Function(Object)> _errorHandlers = [];

  /// Constructor to initialize the WebSocket client
  /// 
  /// [url] - The WebSocket server URL. Use it if the server URL is different from the default one taken from the AsyncAPI document.
  PostmanEchoWebSocketClient({String? url})
    : _url = url ?? 'wss://ws.postman-echo.com/raw';


  /// Method to establish a WebSocket connection
  Future<void> connect() async {
    try {
      final wsUrl = Uri.parse(_url);
      _channel = WebSocketChannel.connect(wsUrl);
      print('Connected to Postman Echo WebSocket server');

        /// Listen to the incoming message stream
      _channel!.stream.listen(
        (message) {
          if (_messageHandlers.isNotEmpty) {
            for (var handler in _messageHandlers) {
              _handleMessage(message, handler);
            }
          } else {
            print('Message received: $message');
          }
        },
        onError: (error) {
          if (_errorHandlers.isNotEmpty) {
            for (var handler in _errorHandlers) {
            handler(error);
          }
        } else {
          print('WebSocket Error: $error');
        }
      },
      onDone: () {
        print('Disconnected from Postman Echo WebSocket server');
      },
    );
  } catch (error) {
    print('Connection failed: $error');
    rethrow;
   }
  }

  /// Method to register custom message handlers
  void registerMessageHandler(void Function(String) handler) {
    _messageHandlers.add(handler);
  }

  /// Method to register custom error handlers
  void registerErrorHandler(void Function(Object) handler) {
    _errorHandlers.add(handler);
  }

  /// Method to handle message with callback
  void _handleMessage(String message, void Function(String) cb) {
    cb(message);
  }

  /// Method to send an echo message to the server
  void sendEchoMessage(String message) {
    if (_channel != null) {
      _channel!.sink.add(message);
      print('Sent message to echo server: $message');
    }
  }

  /// Method to close the WebSocket connection
  void close() {
      if (_channel != null) {
        _channel!.sink.close();
        print('WebSocket connection closed.');
      }
  }
}

