import { Text } from '@asyncapi/generator-react-sdk';

/**
 * Renders an overview section for a WebSocket client.
 * Displays the API description, version, and server URL.
 * 
 * @param {Object} props - Component props 
 * @param {object} props.info - Info object from the AsyncAPI document.
 * @param {string} props.title - Title from the AsyncAPI document.
 * @param {string} props.serverUrl - ServerUrl from a specific server from the AsyncAPI document.
 * @returns {JSX.Element} A Text Component that contains the Overview of a Websocket client.
 * 
 * @example
 *  
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * import { getServer, getServerUrl } from '@asyncapi/generator-helpers';
 * 
 * async function renderOverview(){
 *   const parser = new Parser();
 *   const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');
 * 
 *   //parse the AsyncAPI document
 *   const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
 *   const parsedAsyncAPIDocument = parseResult.document;
 * 
 *   const info = parsedAsyncAPIDocument.info();
 *   const title = info.title();
 *   const server = getServer(parsedAsyncAPIDocument.servers(), 'withoutPathName');
 *   const serverUrl = getServerUrl(server);
 * 
 *   return (
 *      <Overview 
 *        info={info} 
 *        title={title} 
 *        serverUrl={serverUrl} 
 *      />
 *   )
 * }
 * 
 * renderOverview().catch(console.error);
 * 
 */

export function Overview({ info, title, serverUrl }) {
  return (
    <Text newLines={2}>
      {`## Overview

${info.description() || `A WebSocket client for ${title}.`}

- **Version:** ${info.version()}
- **Server URL:** ${serverUrl}
`}
    </Text>
  );
}

