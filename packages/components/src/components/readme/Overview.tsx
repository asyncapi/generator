import { Text } from '@asyncapi/generator-react-sdk';
import { missingInfo } from '../../utils/ErrorHandling';

interface OverviewProps {
  /** Info object from the AsyncAPI document. */
  info: unknown;
  /** Title from the AsyncAPI document. */
  title: string;
  /** ServerUrl from a specific server from the AsyncAPI document. */
  serverUrl: string;
}

/**
 * Renders an overview section for a WebSocket client. Displays the API description, version, and server URL.
 *
 * @param props - Component props
 * @returns A Text component that contains the Overview of a Websocket client.
 * @throws When an info object is missing or invalid.
 *
 * @example
 *
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * import { getServer, getServerUrl } from '@asyncapi/generator-helpers';
 * import { Overview } from "@asyncapi/generator-components";
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

export function Overview({ info, title, serverUrl }: OverviewProps): JSX.Element {
  const infoObj = info as { version?: () => string; description?: () => string | undefined } | null | undefined;
  if (!infoObj || typeof infoObj.version !== 'function') {
    throw missingInfo();
  }

  return (
    <Text newLines={2}>
      {`## Overview

${infoObj.description?.() || `A WebSocket client for ${title}.`}

- **Version:** ${infoObj.version()}
- **Server URL:** ${serverUrl}
`}
    </Text>
  );
}
