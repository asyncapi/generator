/**
 * @jest-environment node
 */

const WSClient = require('../javascript/test/temp/snapshotTestResult/client-hoppscotch');
const { waitForMessageLog, delay } = require('./utils');
const wsClient = new WSClient('ws://localhost:8081/api/ws/Hoppscotch+WebSocket+Server/1.0.0/sendTimeStampMessage');

describe('client - receiver tests', () => {
  jest.setTimeout(10000);
  const logSpy = jest.spyOn(console, 'log').mockImplementation();

  it('javascript client should receive a message', async () => {
    // registering message handler that drops incomming message to logs
    // later logs are evaluated to make sure the message sent from server is received by the client
    wsClient.registerMessageHandler(
      (message) => {
        console.log(message);
      }
    );

    await wsClient.connect();

    // wait for the incomming message to be logged
    await waitForMessageLog(
      logSpy, 
      '11:13:24 GMT+0000 (Coordinated Universal Time)'
    );

    // checking if microcks mock send proper message
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('11:13:24 GMT+0000 (Coordinated Universal Time)'));
  });

  afterAll(async () => {
    wsClient.close();

    //jest doesn't like that on client closure some logs are printed
    // so we need to wait second or 2 until all logs are printed
    await delay();

    logSpy.mockRestore();
  });
});