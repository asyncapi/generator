/**
 * @jest-environment node
 */

const WSClient = require('../../javascript/test/temp/snapshotTestResult/client-hoppscotch');
const { waitForMessage, delay, waitForTestSuccess } = require('./utils');
const fetch = require('node-fetch');
const WebSocket = require('ws');
const microcksTestEndpoint = 'http://microcks:8080/api/tests';

describe('client - receiver tests', () => {
  jest.setTimeout(10000);
  /*
  * TEST: we test if the generated client can be instantiated with custom URL
  */
  const wsClient = new WSClient(
    'ws://microcks-async-minion:8081/api/ws/Hoppscotch+WebSocket+Server/1.0.0/sendTimeStampMessage'
  );

  it('javascript client should receive a message', async () => {
    const received_messages = [];
    const expectedMessage = '11:13:24 GMT+0000 (Coordinated Universal Time)';

    /*
    * TEST: we test if generated message handler can be registered and later records messages
    */
    // registering message handler that adds incomming messages to an array
    // later messages from array are evaluated to make sure the message sent from server is received by the client
    wsClient.registerMessageHandler((message) => {
      received_messages.push(message);
    });

    /*
    * TEST: we test if we can connect to server using genrated client
    */
    await wsClient.connect();

    // wait for the incomming message to be logged
    await waitForMessage(received_messages, expectedMessage);

    const isReceived = received_messages.some((message) =>
      message.includes(expectedMessage)
    );

    // checking if microcks mock send proper message and they were recorded by registered handler for incomming messages
    expect(isReceived).toEqual(true);
  });

  afterAll(async () => {
    wsClient.close();

    //jest doesn't like that on client closure some logs are printed
    // so we need to wait second or 2 until all logs are printed
    await delay();
  });
});

describe('client - sender tests', () => {
  jest.setTimeout(100000);
  const port = 8082;
  const payload = JSON.stringify({
    serviceId: 'Hoppscotch WebSocket Server:1.0.0',
    testEndpoint: 'ws://websocket-acceptance-tester:8082/ws',
    runnerType: 'ASYNC_API_SCHEMA',
    timeout: 30000,
    filteredOperations: ['RECEIVE handleEchoMessage'],
  });

  //this is a custom server that needs to be used to expose endpoint to which microcks will connect and await for messages comming from generated function
  const wsServer = new WebSocket.Server({ port, path: '/ws' }, () => {
    console.log(`Test WS server running on port ${port}`);
  });

  it('javascript client should send a valid message', async () => {
    //await delay(100000);
    const expectedMessage = 'Sending acceptance test message';

    wsServer.on('connection', (socket) => {
      /*
      * TEST: sending message with generated function to microcks test client that connected to our custom server
      */
      WSClient.sendEchoMessage(expectedMessage, socket);
    });

    // Start test in Microcks
    const response = await fetch(microcksTestEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    //checking test result
    const responseBody = await response.json();
    const status = await waitForTestSuccess(`${microcksTestEndpoint}/${responseBody.id}`);

    expect(status).toEqual(true);
  });

  afterAll(async () => {
    wsServer.close();
    //jest doesn't like that on client closure some logs are printed
    // so we need to wait second or 2 until all logs are printed
    await delay();
  });
});
