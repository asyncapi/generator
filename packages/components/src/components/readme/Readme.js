import { File, Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServer, getServerUrl, getInfo, getTitle } from '@asyncapi/generator-helpers';
import { Overview } from './Overview';
import { Installation } from './Installation';
import { Usage } from './Usage';
import { CoreMethods } from './CoreMethods';
import { AvailableOperations } from './AvailableOperations';

/**
 * @typedef {'python' | 'javascript' } Language
 * Supported programming languages.
 */

/**
 * Renders a README.md file for a given AsyncAPI document.
 * 
 * Composes multiple sections (overview, installation, usage, core methods,
 * and available operations) into a single File component based on the
 * provided AsyncAPI document, generator parameters, and target language.
 * @param {Object} props - Component props
 * @param {AsyncAPIDocumentInterface} props.asyncapi - Parsed AsyncAPI document instance.
 * @param {Object} props.params - Generator parameters used to customize output 
 * @param {Language} props.language - Target language used to render language-specific sections.
 * @returns {JSX.Element} A File component representing the generated README.md.
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

export function Readme({ asyncapi, params, language }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const title = getTitle(asyncapi);
  const serverUrl = getServerUrl(server);

  const operations = asyncapi.operations().all();

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

