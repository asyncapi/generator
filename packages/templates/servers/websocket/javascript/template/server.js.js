import { File, Text } from '@asyncapi/generator-react-sdk';
import { getServer, getInfo } from '@asyncapi/generator-helpers';
import { FileHeaderInfo } from '@asyncapi/generator-components';
import { ServerClass } from '../components/ServerClass';

function resolveAsyncApiExtension(originalAsyncAPI) {
  try {
    JSON.parse(originalAsyncAPI);
    return 'json';
  } catch {
    return 'yaml';
  }
}

function isReceiveOp(op) {
  const action = op.action();
  return action === 'receive' || action === 'publish';
}

function isSendOp(op) {
  const action = op.action();
  return action === 'send' || action === 'subscribe';
}

function getChannelOperations(ch, operations) {
  if (ch.operations && !ch.operations().isEmpty()) {
    return ch.operations().all();
  }
  const address = ch.address();
  return operations.filter(op => {
    const opChs = op.channels();
    return opChs.all ? opChs.all().some(c => c.id() === ch.id() || c.address() === address) : false;
  });
}

function buildChannelsInfo(channels, operations) {
  return channels.map(ch => {
    const chOps = getChannelOperations(ch, operations);
    return {
      address: ch.address(),
      receiveOps: chOps.filter(isReceiveOp).map(op => op.id()),
      sendOps: chOps.filter(isSendOp).map(op => op.id())
    };
  });
}

function buildSendOperations(operations) {
  return operations.filter(isSendOp).map(op => {
    const opChs = op.channels();
    const firstCh = opChs.all && opChs.all().length > 0 ? opChs.all()[0] : null;
    return {
      id: op.id(),
      channelAddress: firstCh ? firstCh.address() : '/'
    };
  });
}

/**
 * Generates the Node.js WebSocket server file.
 *
 * @param {Object} args Template arguments.
 * @param {Object} args.asyncapi Parsed AsyncAPI document.
 * @param {Object} args.params Template parameters.
 * @param {string} args.originalAsyncAPI Raw document string.
 * @returns {import('@asyncapi/generator-react-sdk').File} Generated server file component.
 */
export default function ({ asyncapi, params = {}, originalAsyncAPI }) {
  const info = getInfo(asyncapi);
  const server = (params.server && getServer(asyncapi.servers(), params.server)) || (!asyncapi.servers().isEmpty() ? asyncapi.servers().all()[0] : null);

  const asyncapiFileExtension = resolveAsyncApiExtension(originalAsyncAPI);
  const asyncapiFileDir = params.asyncapiFileDir || '.';
  const asyncapiFilepath = `${asyncapiFileDir}/asyncapi.${asyncapiFileExtension}`;

  const channels = asyncapi.channels().all();
  const operations = asyncapi.operations().all();

  const channelsInfo = buildChannelsInfo(channels, operations);
  const allOps = operations.map(op => op.id());
  const receiveOps = operations.filter(isReceiveOp).map(op => op.id());
  const sendOps = operations.filter(isSendOp).map(op => op.id());
  const sendOperations = buildSendOperations(operations);

  const defaultPort = params.port || '8080';
  const serverFileName = params.serverFileName || 'server.js';

  return (
    <File name={serverFileName}>
      {server && (
        <FileHeaderInfo
          info={info}
          server={server}
          language="javascript"
        />
      )}
      <Text newLines={2}>
        {`const http = require('http');
const path = require('path');
const { URL } = require('url');
const WebSocket = require('ws');
const { compileSchemasByOperationId, validateMessage } = require('@asyncapi/keeper');

const asyncapiFilepath = path.resolve(__dirname, '${asyncapiFilepath}');`}
      </Text>
      <ServerClass
        channelsInfo={channelsInfo}
        receiveOps={receiveOps}
        sendOps={sendOps}
        allOps={allOps}
        sendOperations={sendOperations}
        defaultPort={defaultPort}
      />
    </File>
  );
}
