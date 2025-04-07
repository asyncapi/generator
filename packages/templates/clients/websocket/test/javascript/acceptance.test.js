/**
 * @jest-environment node
 */

const WSClient = require('../../javascript/test/temp/snapshotTestResult/client-hoppscotch');
const { waitForMessage, delay } = require('./utils');
const wsClient = new WSClient('ws://localhost:8081/api/ws/Hoppscotch+WebSocket+Server/1.0.0/sendTimeStampMessage');

describe('client - receiver tests', () => {
  jest.setTimeout(10000);

  it('javascript client should receive a message', async () => {
    const received_messages = [];
    const expectedMessage = '11:13:24 GMT+0000 (Coordinated Universal Time)';
    // registering message handler that adds incomming messages to an array
    // later messages from array are evaluated to make sure the message sent from server is received by the client
    wsClient.registerMessageHandler(
      (message) => {
        received_messages.push(message);
      }
    );

    await wsClient.connect();

    // wait for the incomming message to be logged
    await waitForMessage(
      received_messages, 
      expectedMessage
    );

    const isReceived = received_messages.some(message => message.includes(expectedMessage));

    // checking if microcks mock send proper message
    expect(isReceived).toEqual(true);
  });

  afterAll(async () => {
    wsClient.close();

    //jest doesn't like that on client closure some logs are printed
    // so we need to wait second or 2 until all logs are printed
    await delay();
  });
});