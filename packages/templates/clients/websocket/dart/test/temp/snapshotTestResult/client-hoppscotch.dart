//////////////////////////////////////////////////////////////////////
///
/// Hoppscotch Echo WebSocket - 1.0.0
/// Protocol: wss
/// Host: echo-websocket.hoppscotch.io
///
//////////////////////////////////////////////////////////////////////

import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';

class HoppscotchEchoWebSocketClient {

  final String _url;
  WebSocketChannel? _channel;
  final List<void Function(String)> _messageHandlers = [];
  final List<void Function(Object)> _errorHandlers = [];

  /// Constructor to initialize the WebSocket client
  /// 
  /// [url] - The WebSocket server URL. Use it if the server URL is different from the default one taken from the AsyncAPI document.
  HoppscotchEchoWebSocketClient({String? url})
    : _url = url ?? 'wss://echo-websocket.hoppscotch.io';


  /// Method to establish a WebSocket connection
  Future<void> connect() async {
    try {
      final wsUrl = Uri.parse(_url);
      _channel = WebSocketChannel.connect(wsUrl);
      print('Connected to Hoppscotch Echo WebSocket server');

        /// Listen to the incoming message stream
      _channel?.stream.listen(
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
          _channel = null;
          print('Disconnected from Hoppscotch Echo WebSocket server');
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
  void _handleMessage(dynamic message, void Function(String) cb) {
    cb(message);
  }

  /// Method to send an echo message to the server
  void sendEchoMessage(dynamic message) {
    if (_channel == null) {
      print('Error: WebSocket is not connected.');
      return;
    }
    final payload = message is String ? message : jsonEncode(message);
    _channel!.sink.add(payload);
    print('Sent message to echo server: $payload');
  }

  /// Method to close the WebSocket connection
  void close() {
    _channel?.sink.close();
    _channel = null;
    print('WebSocket connection closed.');
  }
}

