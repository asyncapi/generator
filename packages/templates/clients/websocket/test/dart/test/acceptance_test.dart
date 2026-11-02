import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:test/test.dart';

import '../../../dart/test/temp/snapshotTestResult/client_hoppscotch/client.dart';

void main() {
  const microcksTestEndpoint = 'http://microcks:8080/api/tests';
  const serverPort = 8085;

  group('Dart WebSocket Acceptance Tests', () {
    test('dart client should receive a message from Microcks mock server', () async {
      // Why: Microcks minion periodically emits timestamps on this WebSocket mock endpoint.
      // We verify the generated Dart client connects and receives messages matching the contract.
      final client = HoppscotchEchoWebSocketClient(
        url: 'ws://microcks-async-minion:8081/api/ws/Hoppscotch+Echo+WebSocket+Server/1.0.0/sendTimeStampMessage',
      );
      final receivedMessages = <String>[];
      const expectedMessage = 'GMT+0000 (Coordinated Universal Time)';

      client.registerMessageHandler((message) {
        receivedMessages.add(message);
      });

      await client.connect();

      final stopwatch = Stopwatch()..start();
      while (receivedMessages.isEmpty && stopwatch.elapsed < const Duration(seconds: 15)) {
        await Future.delayed(const Duration(milliseconds: 100));
      }

      client.close();

      expect(receivedMessages, isNotEmpty, reason: 'Expected message was not received within timeout');
      expect(
        receivedMessages.first,
        contains(expectedMessage),
        reason: "Expected message containing '$expectedMessage' but got '${receivedMessages.first}'",
      );
    });

    test('dart client should send a valid message validated by Microcks', () async {
      const expectedOutgoingMessage = 'Sending acceptance test message to Microcks.';

      // Start custom WebSocket server on port 8085 to receive connections from Microcks
      final server = await HttpServer.bind(InternetAddress.anyIPv4, serverPort);
      final connectedSockets = <WebSocket>[];
      final microcksConnected = Completer<void>();

      server.transform(WebSocketTransformer()).listen((WebSocket socket) {
        connectedSockets.add(socket);
        if (!microcksConnected.isCompleted) {
          microcksConnected.complete();
        }
        socket.listen((data) {
          // Relay message sent by generated Dart client to Microcks
          for (final s in connectedSockets) {
            if (s != socket) {
              s.add(data);
            }
          }
        });
      });

      // Post test execution request to Microcks
      final payload = jsonEncode({
        'serviceId': 'Hoppscotch Echo WebSocket Server:1.0.0',
        'testEndpoint': 'ws://websocket-acceptance-tester-dart:$serverPort/ws',
        'runnerType': 'ASYNC_API_SCHEMA',
        'timeout': 30000,
        'filteredOperations': ['RECEIVE handleEchoMessage'],
      });

      final response = await http.post(
        Uri.parse(microcksTestEndpoint),
        headers: {'Content-Type': 'application/json'},
        body: payload,
      );

      expect(response.statusCode, anyOf(equals(200), equals(201)),
          reason: 'Failed to initiate Microcks test: ${response.statusCode} ${response.body}');

      final testResult = jsonDecode(response.body) as Map<String, dynamic>;
      final testId = testResult['id'];

      // Wait for Microcks to connect to our server
      await microcksConnected.future.timeout(
        const Duration(seconds: 15),
        onTimeout: () => throw TimeoutException('Microcks did not connect to testEndpoint within 15 seconds'),
      );

      // Connect our generated Dart client and send the message through it
      final client = HoppscotchEchoWebSocketClient(url: 'ws://127.0.0.1:$serverPort/ws');
      await client.connect();

      // Send the echo message using generated client method
      client.sendEchoMessage(expectedOutgoingMessage);

      // Allow transmission time before closing
      await Future.delayed(const Duration(milliseconds: 500));
      client.close();

      // Poll Microcks for test success
      var testSuccess = false;
      for (var i = 0; i < 30; i++) {
        await Future.delayed(const Duration(seconds: 1));
        final pollResponse = await http.get(
          Uri.parse('$microcksTestEndpoint/$testId'),
          headers: {'Accept': 'application/json'},
        );

        if (pollResponse.statusCode == 200) {
          final pollResult = jsonDecode(pollResponse.body) as Map<String, dynamic>;
          final inProgress = pollResult['inProgress'] ?? false;
          final success = pollResult['success'] ?? false;

          if (!inProgress && success) {
            testSuccess = true;
            break;
          }
        }
      }

      await server.close(force: true);
      expect(testSuccess, isTrue, reason: 'Microcks test did not report success for Dart client');
    });
  });
}
