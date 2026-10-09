import { File, Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServer, getServerUrl, getInfo, getTitle } from '@asyncapi/generator-helpers';
import { Overview } from './Overview';
import { Installation } from './Installation';
import { Usage } from './Usage';
import { CoreMethods } from './CoreMethods';
import { AvailableOperations } from './AvailableOperations';
import { missingAsyncAPIDocument, invalidParams } from '../../utils/ErrorHandling';

interface ReadmeParams {
  server: string;
  appendClientSuffix?: boolean;
  customClientName?: string;
  clientFileName: string;
  [key: string]: unknown;
}

interface ReadmeProps {
  /** Parsed AsyncAPI document instance. */
  asyncapi: unknown;
  /** Generator parameters used to customize output. */
  params: ReadmeParams;
  /** Target language used to render language-specific sections. */
  language: string;
}

/**
 * Renders a README.md file for a given AsyncAPI document. Composes multiple sections (overview, installation, usage, core methods, and available operations) into a single File component based on the provided AsyncAPI document, generator parameters, and target language.
 * @param props - Component props
 * @returns A File component representing the generated README.md.
 * @throws When asyncapi is missing or invalid.
 * @throws When params object is missing or invalid.
 *
 * @example
 * import path from "path";
 * import { Parser, fromFile } from "@asyncapi/parser";
 * import { buildParams } from '@asyncapi/generator-helpers';
 * import { Readme } from "@asyncapi/generator-components";
 *
 * async function renderReadme(){
 *   const parser = new Parser();
 *   const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');
 *
 *   // parse the AsyncAPI document
 *   const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
 *   const parsedAsyncAPIDocument = parseResult.document;
 *   const language = "javascript";
 *   const config = { clientFileName: 'myClient.js' };
 *   const params = buildParams('javascript', config, 'echoServer');
 *
 *   return (
 *     <Readme
 *       asyncapi={parsedAsyncAPIDocument}
 *       params={params}
 *       language={language}
 *     />
 *   )
 * }
 *
 * renderReadme().catch(console.error);
 *
 */

export function Readme({ asyncapi, params, language }: ReadmeProps): JSX.Element {
  if (!asyncapi) {
    throw missingAsyncAPIDocument();
  }

  if (!params) {
    throw invalidParams(params);
  }

  const doc = asyncapi as { servers(): unknown; operations(): { all(): unknown[] } };
  const server = getServer(doc.servers() as Parameters<typeof getServer>[0], params.server);
  const info = getInfo(asyncapi as Parameters<typeof getInfo>[0]);
  const clientName = getClientName(asyncapi as Parameters<typeof getClientName>[0], params.appendClientSuffix, params.customClientName);
  const title = getTitle(asyncapi as Parameters<typeof getTitle>[0]);
  const serverUrl = getServerUrl(server);

  const operations = doc.operations().all();

  return (
    <File name="README.md">
      <Text newLines={2}>{`# ${title}`}</Text>
      <Overview info={info} title={title} serverUrl={serverUrl} />
      <Installation language={language}/>
      <Usage
        clientName={clientName}
        clientFileName={params.clientFileName}
        language={language}
      />
      <CoreMethods language={language} />
      {operations.length > 0 && <AvailableOperations operations={operations} />}
    </File>
  );
}
